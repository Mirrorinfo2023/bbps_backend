const { connect, config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config');
const { QueryTypes, Sequelize, sequelize, Model, DataTypes, Op } = require('sequelize');
const utility = require('../../utility/utility');
const bbpsUtility = require('../../utility/bbps.utility');
const rechargeUtility = require('../../utility/recharge.utility');
const jwt = require('jsonwebtoken');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);


class BillPayment {

  db = {};

  constructor() {
    this.db = connect();

  }

  async billPay(req, res, ipAddress) {
    console.log("📩 billPay() Started");
    console.log("👉 Incoming Body:", req.body);

    let { client_id, encReq } = req.body;

    if (!client_id || !encReq) {
      console.log("❌ Missing client_id or encReq");
      return res.status(400).json({ status: 400, message: "Missing client_id or encReq" });
    }

    try {
      console.log("🔍 Validating client...");
      const client = await this.db.user.findOne({
        where: { client_id, status: 1 },
        attributes: ['client_id', 'secret_key'],
      });

      console.log("🧩 Client Found:", client);

      if (!client) {
        console.log("❌ Invalid client_id");
        return res.status(401).json({ status: 401, message: "Invalid client_id" });
      }

      const secret_key = client.secret_key;

      console.log("🔐 Decrypting encReq...");
      const decryptedObject = utility.clientDataDecrypt(encReq, secret_key);
      console.log("🔓 Decrypted Object:", decryptedObject);

      if (!decryptedObject) {
        console.log("❌ Decryption failed");
        return res.status(400).json({ status: 400, message: "Decryption failed or invalid data" });
      }

      const { amount, biller_id, cwallet, transaction_id } = decryptedObject;
      console.log("🗝 Extracted Keys:", { amount, biller_id, cwallet, transaction_id });

      const requiredKeys = ["amount", "biller_id", "cwallet", "transaction_id"];
      for (let key of requiredKeys) {
        if (!decryptedObject[key]) {
          console.log(`❌ Missing Required Key: ${key}`);
          return res.status(400).json(
            utility.DataEncrypt(JSON.stringify({
              status: 400,
              message: `Missing required field: ${key}`,
              columns: requiredKeys
            }))
          );
        }
      }

      // Transaction begin
      console.log("🌀 Starting DB Transaction...");
      let t = await this.db.sequelize.transaction();

      console.log("🔍 Fetching user data...");
      const clientdata = await this.db.user.getData(['id'], { client_id });
      console.log("👤 Client DB Data:", clientdata);

      const userId = clientdata.id;

      console.log("💰 Fetching wallet balance...");
      let walletbalance = await this.db.wallet.getWalletAmount(userId);
      console.log("💳 Wallet Balance:", walletbalance);

      console.log("⚙ Fetching settings...");
      const setting = await this.db.setting.getDataRow(['bbps_cutoff_limit']);
      console.log("🔧 Settings:", setting);

      console.log("👤 Fetching user profile...");
      const userRow = await this.db.user.getData(['first_name', 'last_name', 'mobile', 'email'], { id: userId });

      console.log("🏦 Fetching biller info...");
      const biller_info = await this.db.bbpsBillerInfo.getData({ biller_id });

      console.log("🧾 Fetching previous billFetch data...");
      const resultData = await this.db.bbpsBillFetch.getData({
        biller_id,
        user_id: userId,
        status: 2
      });

      console.log("📄 billFetch Result:", resultData);

      if (!resultData || resultData.length === 0 || !biller_info) {
        console.log("❌ No bill dues or biller not found");
        return res.status(500).json(
          utility.DataEncrypt(JSON.stringify({
            status: 500,
            message: 'No bill dues or biller does not exist',
            data: resultData
          }))
        );
      }

      // Wallet balance validation
      if (!walletbalance || walletbalance < amount) {
        console.log("❌ Insufficient wallet balance");
        return res.status(500).json(
          utility.DataEncrypt(JSON.stringify({
            status: 500,
            error: 'Insufficient wallet balance'
          }))
        );
      }

      // Cutoff limit validation
      if (amount >= setting.bbps_cutoff_limit) {
        console.log("⚠ Cutoff exceeded → Payment put on HOLD");

        const inputData = {
          consumer_name: resultData.consumer_name,
          biller_id,
          amount,
          env: config.env,
          user_id: userId,
          transaction_id,
          status: 4,
          description: 'Bill Payment on hold for verification'
        };

        const paymentEntry = await this.db.bbpsBillPayment.insertData(inputData);
        console.log("📝 HOLD Payment Inserted:", paymentEntry);

        const walletData = {
          transaction_id,
          user_id: userId,
          env: config.env,
          type: 'Debit',
          amount,
          sub_type: 'Bill Payment',
          tran_for: 'main'
        };
        await this.db.wallet.insert_wallet(walletData);
        console.log("💳 Wallet Updated (HOLD)");

        return res.status(200).json(
          utility.DataEncrypt(JSON.stringify({
            status: 200,
            message: 'Payment on hold. Contact support.',
            data: paymentEntry
          }))
        );
      }

      // Proceed with live BBPS payment
      console.log("⚡ Initiating BBPS Payment...");
      console.log("biller_info :", biller_info);
      const billerAdhoc = true;

      const { result, reqData } = await bbpsUtility.bbpsBillPay(
        amount,
        biller_id,
        resultData.request_id,
        billerAdhoc,
        userRow.mobile,
        userRow.email,
        resultData.input_params,
        resultData.biller_response,
        resultData.additional_info
      );

      console.log("📦 BBPS reqData:", reqData);
      console.log("📦 BBPS Response:", result);

      if (!result || !result.ExtBillPayResponse) {
        console.log("❌ Invalid BBPS response");
        return res.status(500).json(
          utility.DataEncrypt(JSON.stringify({
            status: 500,
            message: "Invalid response from BBPS",
            response: result
          }))
        );
      }

      // Success ✔
      if (result.ExtBillPayResponse.responseCode === "000") {
        console.log("✅ BBPS PAYMENT SUCCESS");

        const base = result.ExtBillPayResponse;

        const inputData = {
          consumer_name: base.RespCustomerName,
          biller_id,
          amount,
          env: config.env,
          user_id: userId,
          transaction_id,
          status: 1,
          payment_status: 'SUCCESS',
          trax_id: base.txnRefId
        };

        const paymentEntry = await this.db.bbpsBillPayment.insertData(inputData);
        console.log("📝 Payment Entry Inserted:", paymentEntry);

        await this.db.wallet.insert_wallet({
          transaction_id,
          user_id: userId,
          env: config.env,
          type: 'Debit',
          amount,
          sub_type: 'Bill Payment',
          tran_for: 'main'
        });

        console.log("💳 Wallet Updated After Success");

        await this.db.bbpsBillFetch.update({ status: 1 }, { where: { transaction_id } });
        console.log("📄 Bill Fetch Updated");

        return res.status(200).json(
          utility.DataEncrypt(JSON.stringify({
            status: 200,
            message: "Payment Successful",
            data: paymentEntry
          }))
        );
      }

      // Failure ❌ - SHOW ERROR ON FRONTEND
      console.log("❌ BBPS Payment Failed:", result.ExtBillPayResponse);

      const errorData = {
        status: 201,
        message: "Payment failed",
        responseCode: result.ExtBillPayResponse.responseCode,
        errorCode: result.ExtBillPayResponse.errorInfo?.error?.errorCode,
        errorMessage: result.ExtBillPayResponse.errorInfo?.error?.errorMessage,
        raw: result.ExtBillPayResponse
      };

      console.log("📤 Sending Failure Response to Frontend:", errorData);

      return res.status(201).json(
        utility.DataEncrypt(JSON.stringify(errorData))
      );

    } catch (error) {
      console.log("💥 ERROR in billPay():", error);

      return res.status(500).json(
        utility.DataEncrypt(JSON.stringify({
          status: 500,
          message: error.message,
          error: error,
          stack: error.stack
        }))
      );
    }
  }





  async billerInfo(req, res) {
    const date = new Date();

    try {
      const { client_id, encReq } = req.body;
      console.log("req.body", req.body);

      if (!client_id || !encReq) {
        return res.status(400).json({ status: 400, message: "Missing client_id or encReq" });
      }

      // Fetch client secret key
      const client = await this.db.user.findOne({
        where: { client_id, status: 1 },
        attributes: ['client_id', 'secret_key'],
      });

      if (!client || !client.secret_key) {
        return res.status(401).json({ status: 401, message: "Invalid client or missing secret_key" });
      }

      const secret_key = client.secret_key;

      // Decrypt request
      let decryptedObject;
      try {
        decryptedObject = utility.clientDataDecrypt(encReq, secret_key);
        if (typeof decryptedObject === 'string') {
          decryptedObject = JSON.parse(decryptedObject);
        }
      } catch (err) {
        return res.status(400).json({
          status: 400,
          message: "Invalid encrypted payload",
          error: err.message
        });
      }

      const { biller_id } = decryptedObject;
      const user_id = client_id
      if (!biller_id) {
        return res.status(400).json({
          status: 400,
          message: 'Required input data missing',
          requiredKeys: ['biller_id']
        });
      }

      // Check DB
      const checkData = await this.db.bbpsBillerInfo.count({ where: { biller_id } });

      let billerData = [];

      if (checkData === 0) {
        console.log("Fetching from BBPS Utility...");

        // REQUIRED CHANGE (as you said)
        const billerArray = { biller_id };
        const { result, reqData } = await bbpsUtility.bbpsBillerInfo(billerArray);

        console.log("Utility Output:", result);

        if (result.status === 200 && result.data?.length) {
          const data = result.data;

          const insertData = {
            user_id,
            biller_id: data.biller_id,
            biller_name: data.biller_name,
            biller_category: data.biller_category,
            status: 1,
            input_params: data.input_params,
            response_json: JSON.stringify(result.data),
            created_on: date.getTime()
          };

          await this.db.bbpsBillerInfo.insertData(insertData);
          billerData.push(insertData);
        } else {
          return res.status(500).json({
            status: 500,
            message: 'Invalid BBPS response from utility'
          });
        }

      } else {
        billerData = await this.db.bbpsBillerInfo.getData({ biller_id });
      }

      // Send encrypted response
      const encryptedResponse = utility.clientDataEncrypt({
        status: 200,
        data: billerData
      }, secret_key);

      return res.status(200).send(encryptedResponse);

    } catch (error) {
      console.error("Error in billerInfo:", error.message);
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        error: error.message
      });
    }
  }


  async billFetch(req, res, ipAddress) {
    try {
      console.log("🔹 [billFetch] API called at:", new Date().toISOString());
      console.log("📥 Incoming Request Body:", req.body);

      const { client_id, encReq } = req.body;

      if (!client_id || !encReq) {
        console.warn("⚠️ Missing client_id or encReq in request");
        return res.status(400).json({ status: 400, message: "Missing client_id or encReq" });
      }

      // 🔹 Step 2: Fetch client info from DB
      console.log("🔍 Fetching client from DB with client_id:", client_id);
      const client = await this.db.user.findOne({
        where: { client_id, status: 1 },
        attributes: ["client_id", "secret_key", "id"],
      });

      if (!client) {
        console.warn("❌ Invalid client_id or inactive client:", client_id);
        return res.status(401).json({ status: 401, message: "Invalid client_id" });
      }

      console.log("✅ Client found:", client.client_id);
      const secret_key = client.secret_key;
      console.log("🔐 Retrieved secret_key for client:", client_id);

      // 🔹 Step 3: Decrypt incoming request
      console.log("🔓 Decrypting incoming encReq...");
      let decryptedObject;
      try {
        decryptedObject = utility.clientDataDecrypt(encReq, secret_key);
        console.log("✅ Decrypted Request Object:", decryptedObject);
      } catch (err) {
        console.error("❌ Failed to decrypt incoming request:", err.message);
        return res.status(400).json(
          utility.clientDataEncrypt(
            { status: 400, message: "Invalid encrypted request format" },
            secret_key
          )
        );
      }

      const { biller_id, mobile_no, email_id, inputParam } = decryptedObject;
      console.log("📦 Extracted Fields ->", { biller_id, mobile_no, email_id, inputParam });

      // 🔹 Step 4: Validate required fields
      console.log("🔍 Validating required fields...");
      const requiredKeys = ["biller_id", "mobile_no", "email_id"];
      if (!requiredKeys.every((key) => decryptedObject[key])) {
        console.warn("⚠️ Missing or empty required fields:", decryptedObject);
        return res.status(400).json(
          utility.clientDataEncrypt(
            { status: 400, message: "Required input data is missing or empty", columns: requiredKeys },
            secret_key
          )
        );
      }

      // 🔹 Step 5: Call BBPS Bill Fetch
      console.log("🌐 Calling BBPS Bill Fetch with params:", {
        biller_id,
        inputParam: inputParam?.paramInfo,
        mobile_no,
        email_id,
      });

      const { result, reqData } = await bbpsUtility.bbpsBillFetch(
        biller_id,
        inputParam.paramInfo,
        mobile_no,
        email_id
      );

      // 🧩 Ensure we can safely log BBPS response
      try {
        console.log("📩 BBPS Raw Response:", JSON.stringify(result, null, 2));
      } catch {
        console.warn("⚠️ BBPS Response is not valid JSON (possibly binary). Logging as string...");
        console.log(result);
      }

      console.log("📦 Request Data used in BBPS call:", reqData);

      const responseCode = result?.billFetchResponse?.responseCode;
      if (responseCode === "000") {
        console.log("✅ Bill Fetch Success - Parsing response...");

        const base = result.billFetchResponse.billerResponse;
        const amount = parseFloat(base.billAmount || 0) / 100;
        const consumer_name = base.customerName || null;
        const bill_date = base.billDate ? new Date(base.billDate) : null;
        const bill_period = base.billPeriod || null;
        const due_date = base.dueDate ? new Date(base.dueDate) : null;
        const bill_number = base.billNumber || null;
        const request_id = reqData.requestId;
        const request_data = reqData.encRequest;
        const response_data = reqData.encResponse;
        const inputParams = result.billFetchResponse.inputParams;
        const additionalInfo = result.billFetchResponse.additionalInfo;
        const consumer_no = "";

        const order_id = utility.generateUniqueNumeric(7);
        const transaction_id = order_id;

        const orderData = {
          user_id: client.id,
          env: config.env,
          tran_type: "Debit",
          tran_sub_type: "Bill Payment",
          tran_for: "Bill Payment",
          trans_amount: amount,
          currency: "INR",
          order_id,
          order_status: "PENDING",
          created_on: Date.now(),
          created_by: client_id,
          ip_address: ipAddress,
        };
        console.log("📝 Inserting Order Data:", orderData);

        await this.db.upi_order.insertData(orderData);

        const fetchData = {
          user_id: client.id,
          transaction_id,
          biller_id,
          request_id,
          request_data,
          response_data,
          consumer_no,
          consumer_name,
          bill_amount: amount,
          late_fine: 0,
          fixed_charge: 0,
          additional_charge: 0,
          bill_period,
          bill_number,
          status: 2,
          created_on: Date.now(),
          created_by: client_id,
          response_json: JSON.stringify(result),
          input_params: JSON.stringify(inputParams),
          biller_response: JSON.stringify(base),
          additional_info: JSON.stringify(additionalInfo),
        };

        if (bill_date) fetchData.bill_date = bill_date;
        if (due_date) fetchData.due_date = due_date;

        console.log("💾 Saving Bill Fetch Data:", fetchData);

        const billFetchEntry = await this.db.bbpsBillFetch.insertData(fetchData);

        if (billFetchEntry) {
          console.log("✅ Bill Fetch entry saved successfully.");
          return res.status(200).json(
            utility.clientDataEncrypt(
              { status: 200, message: "Bill Fetched Successfully", data: billFetchEntry },
              secret_key
            )
          );
        } else {
          console.error("❌ Failed to save bill fetch entry.");
          return res.status(201).json(
            utility.clientDataEncrypt(
              { status: 201, message: "Something went wrong while saving data" },
              secret_key
            )
          );
        }
      } else {
        console.warn("⚠️ Bill Fetch Failed Response:", result.billFetchResponse);
        return res.status(201).json(
          utility.clientDataEncrypt(
            {
              status: 201,
              message: result.billFetchResponse?.errorInfo?.error?.errorMessage || "Bill fetch failed",
              data: result,
            },
            secret_key
          )
        );
      }
    } catch (error) {
      console.error("❌ Error in BBPS billFetch:", error);
      return res.status(500).json(
        utility.clientDataEncrypt(
          { status: 500, error: error.message },
          process.env.MASTER_KEY || "defaultkey"
        )
      );
    }
  }



  async quickPay(req, res) {
    const { client_id, encReq } = req.body;

    if (!client_id || !encReq) {
      return res.status(400).json({ status: 400, message: "Missing client_id or encReq" });
    }

    // 🔹 Step 2: Fetch client info from DB
    const client = await this.db.user.findOne({
      where: { client_id, status: 1 }, // assuming 1 means active
      attributes: ['client_id', 'secret_key'],
    });

    if (!client) {
      return res.status(401).json({ status: 401, message: "Invalid client_id" });
    }

    // 🔹 Step 3: Get secret key from DB
    const secret_key = client.secret_key;

    // 🔹 Step 4: Decrypt incoming request
    const decryptedObject = utility.clientDataDecrypt(encReq, secret_key);

    const { amount, biller_id, cwallet, transaction_id, inputParam } = decryptedObject;

    if (!client_id || !secret_key) {
      return res.status(400).json(utility.clientDataEncrypt({
        status: 400,
        message: 'Client credentials missing'
      }, secret_key));
    }

    let t = await this.db.sequelize.transaction();
    try {
      const clientdata = await this.db.user.getData('id', { client_id: client_id });
      const user_id = clientdata.id;

      // 🔹 Fetch user, biller info, wallet details
      const userRow = await this.db.user.getData(['first_name', 'last_name', 'mobile', 'email'], { id: user_id });
      const biller_info = await this.db.bbpsBillerInfo.getData({ biller_id });
      if (!biller_info) {
        return res.status(400).json(utility.clientDataEncrypt({
          status: 400,
          message: 'Invalid biller_id'
        }, secret_key));
      }

      const walletbalance = await this.db.wallet.getWalletAmount(user_id);
      if (walletbalance < amount) {
        return res.status(400).json(utility.clientDataEncrypt({
          status: 400,
          message: 'Insufficient wallet balance'
        }, secret_key));
      }

      // 🔹 Compute Plan/Prime Logic
      // const checkplan = await this.db.PlanPurchase.getAllPlanUser(user_id);
      // const maxPlan = checkplan.length ? Math.max(...checkplan) : null;
      // const user_type = maxPlan ? 'Prime' : '';
      // const plan_id = maxPlan || null;
      const env = config.env;
      let d_amount = amount;
      let prime_rate = 0, prime_amount = 0, cashback_amount = 0, cashback_rate = 0;

      // if (user_type === 'Prime' && cwallet === 'Prime' && plan_id > 0) {
      //   const plan_details = await this.db.cashbackPlan.getData(plan_id);
      //   const prime_wallet_balance = await this.db.prime.getPrimeAmount(user_id);

      //   if (prime_wallet_balance > 0) {
      //     prime_rate = plan_details.bill_rate;
      //     prime_amount = (amount * prime_rate) / 100;
      //     if (prime_wallet_balance >= prime_amount) {
      //       d_amount -= prime_amount;
      //     }
      //   }
      // }

      // 🔹 Send to BBPS system (live)
      const { result, reqData } = await bbpsUtility.bbpsQuickPay(
        amount,
        biller_id,
        biller_info.biller_adhoc,
        userRow.mobile,
        userRow.email,
        inputParam.paramInfo
      );

      const base = result.ExtBillPayResponse;

      if (base.responseCode === '000') {
        // ✅ Bill payment entry
        const paymentEntry = await this.db.bbpsBillPayment.insertData({
          consumer_name: base.RespCustomerName,
          biller_id,
          amount: d_amount,
          env,
          main_amount: amount,
          user_id,
          transaction_id,
          response_code: base.responseCode,
          status: 1,
          resp_amount: base.RespAmount / 100,
          bill_no: base.RespBillNumber,
          bill_date: base.RespBillDate,
          bill_period: base.RespBillPeriod,
          bill_due_date: base.RespDueDate,
          input_params: JSON.stringify(base.inputParams),
          trax_id: base.txnRefId,
          cust_conv_fee: base.CustConvFee
        }, { transaction: t });

        // ✅ Wallet Debit
        await this.db.wallet.insert_wallet({
          transaction_id,
          user_id,
          env,
          type: 'Debit',
          amount: d_amount,
          sub_type: 'Bill Payment',
          tran_for: 'main'
        }, { transaction: t });

        // ✅ Cashback/Prime Debit if applicable
        if (prime_amount > 0) {
          await this.db.prime.insert_prime_wallet({
            user_id,
            env,
            type: 'Debit',
            sub_type: 'Bill Payment',
            tran_for: 'Bill Payment',
            amount: prime_amount,
            transaction_id
          }, { transaction: t });
        }

        if (cashback_amount > 0) {
          await this.db.cashback.insert_cashback_wallet({
            user_id,
            env,
            type: 'Debit',
            sub_type: 'Bill Payment',
            tran_for: 'Bill Payment',
            amount: cashback_amount,
            transaction_id
          }, { transaction: t });
        }

        await this.db.upi_order.update(
          { order_status: 'SUCCESS' },
          { where: { user_id, order_id: transaction_id }, transaction: t }
        );

        await t.commit();

        return res.status(200).json(utility.clientDataEncrypt({
          status: 200,
          message: 'Payment done successfully',
          data: paymentEntry,
          reqData
        }, secret_key));
      } else {
        await t.rollback();
        return res.status(201).json(utility.clientDataEncrypt({
          status: 201,
          message: 'Payment Failed',
          data: result
        }, secret_key));
      }

    } catch (error) {
      await t.rollback();
      console.error('Error in BBPS quickPay:', error);
      return res.status(500).json(utility.clientDataEncrypt({
        status: 500,
        message: 'Internal Server Error',
        error: error.message
      }, secret_key));
    }
  }


  async bulkBiller(req, res) {

    try {

      const [results, metadata] = await this.db.sequelize.query(`SELECT mst_service_operator.biller_id FROM mst_service_operator
        left join tbl_bbps_bill_info on tbl_bbps_bill_info.biller_id=mst_service_operator.biller_id
        where mst_service_operator.status=1 and mst_service_operator.biller_id is not null and tbl_bbps_bill_info.id is null group by biller_id limit 2000`);

      let billerArray = [];
      for (const data of results) {
        billerArray.push(data.biller_id);
      }

      if (billerArray.length > 0) {
        const { result, reqData } = await bbpsUtility.bbpsBillerInfo(billerArray);

        if (result) {

          const base = result.billerInfoResponse.biller;


          for (const item of base) {
            //return item;
            const billerId = item.billerId;
            const billerName = item.billerName;
            const billerCategory = item.billerCategory;
            const billerInputParams = item.billerInputParams;
            const billerCoverage = item.billerCoverage;
            const billerAdhoc = item.billerAdhoc;
            const billerFetchRequiremet = item.billerFetchRequiremet;

            let consumerNumber = '';
            let distributorId = '';
            let mobileNo = '';
            let consumerId = '';


            const fetchData = {
              biller_id: billerId,
              biller_name: billerName,
              biller_category: billerCategory,
              distributor_id: distributorId,
              biller_coverage: billerCoverage,
              biller_adhoc: billerAdhoc,
              mobile_no: mobileNo,
              consumer_id: consumerId,
              status: 1,
              input_params: JSON.stringify(billerInputParams),
              response_json: JSON.stringify(item),
              biller_fetch_requiremet: billerFetchRequiremet
            }

            await this.db.bbpsBillerInfo.insertData(fetchData);
          }

        }

      }
      return true;

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error or throw it again if needed
    }
  }



  // async billPayHoldApprove(req, res)
  // {
  //   const { user_id, transaction_id } = req;

  //   const requiredKeys = Object.keys({ user_id, transaction_id});

  //   if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
  //       return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
  //   }

  //   let t = await this.db.sequelize.transaction();

  //   try
  //   {

  //     let date = new Date();
  //     let crdate = utility.formatDate(date);
  //     let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  //     let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //     firstDay = utility.formatDate(firstDay);
  //     lastDay = utility.formatDate(lastDay);
  //     let walletbalance = await this.db.wallet.getWalletAmount(user_id);


  //     const whereClause = {'user_id': user_id, 'transaction_id': transaction_id, 'status': 4 }

  //     const getDataBillPayment = await this.db.bbpsBillPayment.getData(whereClause, { transaction: t });
  //     const getPanel = await this.db.panel.getDataPanel(2);
  //     const service_url = getPanel.service_url;

  //     const panelId = getPanel.id;

  //     const requestId = transaction_id;
  //     const amount = getDataBillPayment.main_amount;
  //     const d_amount = getDataBillPayment.amount;
  //     const input_params = getDataBillPayment.input_params;
  //     const biller_id = getDataBillPayment.biller_id;
  //     const operator = await this.db.serviceOperator.getData(biller_id);
  //     const operator_code = operator.bbps_code;
  //     const whereChk={id:user_id};
  //     const UserAttribute=['first_name','last_name','mobile', 'email'];
  //     const userRow = await this.db.user.getData(UserAttribute,whereChk);
  //     const mobile = userRow.mobile;
  //     const ConsumerNumber = mobile;
  //     const prime_amount = getDataBillPayment.service_amount;
  //     const cashback_amount = getDataBillPayment.cashback_amount;

  //     if(walletbalance!=null && walletbalance> 0 && amount <= walletbalance)
  //     {
  //       const {result:response, panel_id } = await rechargeUtility.kppsbbps(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panelId, input_params);

  //       try
  //       {

  //         if(response)
  //         {

  //           const whereClause = { id: getDataBillPayment.id };
  //           const updateData = { 
  //             payment_status: response.status,
  //             status: 1,
  //             resp_amount: amount,
  //             bill_no: response.txn_id,
  //             bill_date: date.getTime(),
  //             trax_id: response.txn_id,
  //           };
  //           const paymentEntry = await this.db.bbpsBillPayment.updateData(updateData, whereClause, { transaction: t });


  //           if(paymentEntry.error == 0)
  //           {
  //             //entry in wallet for deduction
  //             const walletData = {
  //                 transaction_id:transaction_id,
  //                 user_id:user_id,
  //                 env: config.env,
  //                 type:'Debit',
  //                 amount:d_amount,
  //                 sub_type:'Bill Payment',
  //                 tran_for:'main'
  //             };

  //             const walletEntry = await this.db.wallet.insert_wallet(walletData, { transaction: t });

  //             if(walletEntry && cashback_amount > 0)
  //             {

  //                 const cashbackData = {
  //                     user_id:user_id, 
  //                     env: config.env, 
  //                     type: 'Debit', 
  //                     sub_type: 'Bill Payment', 
  //                     tran_for: 'Bill Payment', 
  //                     amount:cashback_amount,
  //                     transaction_id:transaction_id

  //                 };
  //                 const cashbackEntry = await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
  //             }

  //             if(walletEntry && prime_amount>0)
  //             {
  //                 const primeData = {
  //                     user_id:user_id, 
  //                     env: config.env, 
  //                     type: 'Debit', 
  //                     sub_type: 'Bill Payment', 
  //                     tran_for: 'Bill Payment', 
  //                     amount:prime_amount,
  //                     transaction_id:transaction_id
  //                 };

  //                 const primeEntry = await this.db.prime.insert_prime_wallet(primeData, { transaction: t });

  //             }


  //             await this.db.bbpsBillFetch.update(
  //               { status: 1 }, 
  //               { where: {transaction_id:transaction_id}, t }
  //             );

  //             await this.db.upi_order.update(
  //               {order_status: response.status },
  //               { where: { user_id:user_id,order_id:transaction_id }, t }
  //             );

  //             await t.commit();
  //             updateData.transaction_id = transaction_id;
  //             return res.status(200).json({ status: 200,  message: 'Bill payment successfully done', data:updateData});
  //           }
  //           else{
  //             await t.rollback();
  //           }

  //         }

  //       }catch({ result: response, panel_id }){
  //         if(response)
  //         {
  //           const whereClause = { id: getDataBillPayment.id };
  //           const updateData = { 
  //             payment_status: response.status,
  //             status: 3,
  //             resp_amount: amount,
  //             bill_no: response.txn_id,
  //             bill_date: date.getTime(),
  //             trax_id: response.txn_id,
  //           };
  //           const paymentEntry = await this.db.bbpsBillPayment.updateData(updateData, whereClause, { transaction: t });

  //             await this.db.bbpsBillFetch.update(
  //               { status: 3 }, 
  //               { where: {transaction_id:transaction_id}, t }
  //             );

  //             await this.db.upi_order.update(
  //               {order_status: response.status },
  //               { where: { user_id:user_id,order_id:transaction_id }, t }
  //             );
  //             updateData.transaction_id = transaction_id;
  //             await t.commit();
  //             return res.status(200).json({ status: 500, error: 'Sorry ! Failed to bill Paymenty', data: updateData});
  //         }
  //       }

  //     }else{
  //       return res.status(200).json({ status: 500,error: 'You do not have sufficient wallet balance' });
  //     }


  //   }catch (error) {

  //     await t.rollback();
  //       logger.error(`Unable to find user: ${error}`);
  //       if (error.name === 'SequelizeValidationError') {
  //         const validationErrors = error.errors.map((err) => err.message);
  //         return res.status(500).json({ status: 500,errors: validationErrors });
  //       }

  //       return res.status(500).json({ status: 500,  message: error ,data:[]});
  //   }

  // }


  async billPayHoldApprove(req, res) {
    const { user_id, transaction_id } = req;

    const requiredKeys = Object.keys({ user_id, transaction_id });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t = await this.db.sequelize.transaction();

    try {

      let date = new Date();
      let crdate = utility.formatDate(date);
      let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      firstDay = utility.formatDate(firstDay);
      lastDay = utility.formatDate(lastDay);
      let walletbalance = await this.db.wallet.getWalletAmount(user_id);

      const whereClause = { 'user_id': user_id, 'transaction_id': transaction_id, 'status': 4 }
      const getDataBillPayment = await this.db.bbpsBillPayment.getData(whereClause, { transaction: t });
      const getPanel = await this.db.panel.getDataPanel(2);
      const service_url = getPanel.service_url;

      const panelId = getPanel.id;

      const requestId = transaction_id;
      const amount = getDataBillPayment.main_amount;
      const d_amount = getDataBillPayment.amount;
      //const input_params = getDataBillPayment.input_params;
      const biller_id = getDataBillPayment.biller_id;
      const operator = await this.db.serviceOperator.getData(biller_id);
      const operator_code = operator.bbps_code;

      const whereChk = { id: user_id };
      const UserAttribute = ['first_name', 'last_name', 'mobile', 'email'];
      const userRow = await this.db.user.getData(UserAttribute, whereChk);

      const mobile = userRow.mobile;
      const ConsumerNumber = mobile;
      const prime_amount = getDataBillPayment.service_amount;
      const cashback_amount = getDataBillPayment.cashback_amount;

      const biller_info = await this.db.bbpsBillerInfo.getData({ biller_id: biller_id });
      const resultData = await this.db.bbpsBillFetch.getData({ biller_id: biller_id, user_id: user_id, transaction_id: transaction_id, status: 2 });

      let request_id = resultData.request_id;
      let input_params = resultData.input_params;
      let biller_response = resultData.biller_response;
      let additional_info = resultData.additional_info;

      // if(walletbalance!=null && walletbalance> 0 && amount <= walletbalance)
      // {
      //const {result:response, panel_id } = await rechargeUtility.kppsbbps(service_url, requestId, transaction_id, operator_code, mobile, ConsumerNumber, amount, panelId, input_params);
      const { result, reqData } = await bbpsUtility.bbpsBillPay(amount, biller_id, request_id, biller_info.biller_adhoc, userRow.mobile, userRow.email, input_params, biller_response, additional_info);


      if (result.ExtBillPayResponse.responseCode == '000') {

        const base = result.ExtBillPayResponse;
        //update in bill payment
        const updateData = {
          consumer_name: base.RespCustomerName,
          payment_status: 'SUCCESS',
          response_code: base.responseCode,
          status: 1,
          resp_amount: base.RespAmount / 100,
          bill_no: base.RespBillNumber,
          bill_date: base.RespBillDate,
          bill_preriod: base.RespBillPeriod,
          bill_due_date: base.RespDueDate,
          input_params: JSON.stringify(base.inputParams),
          trax_id: base.txnRefId,
          response_code: base.responseCode,
          cust_conv_fee: base.CustConvFee,
        };

        const whereClause = { id: getDataBillPayment.id };
        const paymentEntry = await this.db.bbpsBillPayment.updateData(updateData, whereClause, { transaction: t });

        await this.db.bbpsBillFetch.update(
          { status: 1 },
          { where: { transaction_id: transaction_id }, t }
        );

        await this.db.upi_order.update(
          { order_status: 'SUCCESS' },
          { where: { user_id: user_id, order_id: transaction_id }, t }
        );

        await t.commit();
        updateData.transaction_id = transaction_id;
        return res.status(200).json({ status: 200, message: 'Bill payment successfully done', data: updateData });

      } else {

        const updateData = {
          payment_status: 'FAILED',
          response_code: base.responseCode,
          status: 3,
        };

        const whereClause = { id: getDataBillPayment.id };
        const paymentEntry = await this.db.bbpsBillPayment.updateData(updateData, whereClause, { transaction: t });
        let reTransaction_id = utility.generateUniqueNumeric(7);
        // Order Generate
        const reorderData = {
          user_id: user_id,
          env: config.env,
          tran_type: 'Credit',
          tran_sub_type: 'Bill Payment',
          tran_for: 'Refund',
          trans_amount: amount,
          currency: 'INR',
          order_id: reTransaction_id,
          order_status: 'SUCCESS',
          created_on: Date.now(),
          created_by: user_id,
          ip_address: 0
        };

        const generateorder = await this.db.upi_order.insertData(reorderData);
        if (generateorder) {
          //entry in wallet for deduction
          const walletData = {
            transaction_id: reTransaction_id,
            user_id: user_id,
            env: config.env,
            type: 'Credit',
            amount: d_amount,
            sub_type: 'Bill Payment',
            tran_for: 'main'
          };

          const walletEntry = await this.db.wallet.insert_wallet(walletData, { transaction: t });

          if (walletEntry && cashback_amount > 0) {

            const cashbackData = {
              user_id: user_id,
              env: config.env,
              type: 'Credit',
              sub_type: 'Bill Payment',
              tran_for: 'Refund',
              amount: cashback_amount,
              transaction_id: reTransaction_id

            };
            const cashbackEntry = await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
          }

          if (walletEntry && prime_amount > 0) {
            const primeData = {
              user_id: user_id,
              env: config.env,
              type: 'Debit',
              sub_type: 'Bill Payment',
              tran_for: 'Bill Payment',
              amount: prime_amount,
              transaction_id: reTransaction_id
            };

            const primeEntry = await this.db.prime.insert_prime_wallet(primeData, { transaction: t });

          }


          await this.db.bbpsBillFetch.update(
            { status: 3 },
            { where: { transaction_id: transaction_id }, t }
          );

          await this.db.upi_order.update(
            { order_status: 'FAILED' },
            { where: { user_id: user_id, order_id: transaction_id }, t }
          );
        }

        await t.commit();
        updateData.transaction_id = reTransaction_id;
        return res.status(200).json({ status: 200, message: 'Bill payment failed', data: updateData });

      }


      // }else{
      //   return res.status(200).json({ status: 500,error: 'You do not have sufficient wallet balance' });
      // }


    } catch (error) {

      await t.rollback();
      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: 'Internal Server Error', data: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }

  }


  async billPaymentReject(req, res) {

    const { user_id, transaction_id, reject_reason, admin_user_id } = req;

    const requiredKeys = Object.keys({ user_id, transaction_id, reject_reason, admin_user_id });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }
    let t = await this.db.sequelize.transaction();

    try {
      let date = new Date();
      const whereClause = { 'user_id': user_id, 'transaction_id': transaction_id, 'status': 4 }
      const getDataBillPayment = await this.db.bbpsBillPayment.getData(whereClause, { transaction: t });

      if (getDataBillPayment) {
        const updateData = {
          payment_status: 'REJECT',
          description: reject_reason,
          status: 5,
          updated_on: date.getTime(),
          updated_by: admin_user_id
        }


        const whereClause = { id: getDataBillPayment.id };
        const paymentUpdate = await this.db.bbpsBillPayment.updateData(updateData, whereClause, { transaction: t });

        if (paymentUpdate) {

          //entry in wallet for deduction
          // const walletData = {
          //     transaction_id:transaction_id,
          //     user_id:user_id,
          //     env: config.env,
          //     type:'Credit',
          //     amount:getDataBillPayment.amount,
          //     sub_type:'Bill Payment',
          //     tran_for:'main'
          // };

          // const walletEntry = await this.db.wallet.insert_wallet(walletData, { transaction: t });

          // if(walletEntry && cashback_amount > 0)
          // {

          //     const cashbackData = {
          //         user_id:user_id, 
          //         env: config.env, 
          //         type: 'Credit', 
          //         sub_type: 'Bill Payment', 
          //         tran_for: 'Refund', 
          //         amount:getDataBillPayment.cashback_amount,
          //         transaction_id:transaction_id

          //     };
          //     const cashbackEntry = await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
          // }

          // if(walletEntry && prime_amount>0)
          // {
          //     const primeData = {
          //         user_id:user_id, 
          //         env: config.env, 
          //         type: 'Debit', 
          //         sub_type: 'Bill Payment', 
          //         tran_for: 'Bill Payment', 
          //         amount:getDataBillPayment.service_amount,
          //         transaction_id:transaction_id
          //     };

          //     const primeEntry = await this.db.prime.insert_prime_wallet(primeData, { transaction: t });

          // }
          return res.status(200).json({ status: 200, message: 'Bill payment rejected successfully' });
        }

      } else {
        return res.status(201).json({ status: 500, message: 'Data not found', data: [] });
      }


    } catch (error) {

      logger.error(`Unable to find record: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
  }


  async billFetchTesting(req, res, ipAddress) {
    let t = await this.db.sequelize.transaction();
    try {

      const { biller_id, user_id, mobile_no, email_id, inputParam } = req;
      const requiredKeys = Object.keys({ biller_id, user_id, mobile_no, email_id });
      let date = new Date();

      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }
      //return inputParam;
      //const resultData = await this.db.bbpsBillerInfo.getData({biller_id: biller_id});
      // const inputParam = {
      //     "paramInfo": {
      //       "paramName": "User Id",
      //       "paramValue": "160240233379",
      //       "dataType": "ALPHANUMERIC",
      //       "isOptional": "false",
      //       "minLength": "1",
      //       "maxLength": "25"
      //     }
      // };
      //return typeof inputParam.paramInfo;



      const { result, reqData } = await bbpsUtility.bbpsBillFetch(biller_id, inputParam.paramInfo, mobile_no, email_id);

      return res.status(200).json({ status: 200, message: result.billFetchResponse.errorInfo.error.errorMessage, data: result, reqData: reqData });

    } catch (error) {
      console.error('An error occurred:', error);
      // Handle the error or throw it again if needed
      return res.status(500).json({ status: 500, error: error.message });
    }
  }


}

module.exports = new BillPayment();