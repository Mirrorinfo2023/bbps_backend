const { connect, config, baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const utility = require('../../utility/utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');
const whatsappUtility = require('../../utility/whatsapp.utility');
const notificationUtility = require('../../utility/fcm_notification.utitlity');

class AddMoney {
  db = {};

  constructor() {
    this.db = connect();
  }

    async addMoneyRequest(filename, req, res) {
    //const decryptedObject = utility.DataDecrypt(req.body.encReq);
    const { user_id, amount, category, trans_no, wallet } = req.body;

    try {
      const filePath = filename;
      const whereChk = { client_id: user_id };
      const UserAttribute = ['id', 'first_name', 'last_name', 'mobile'];
      const userRow = await this.db.user.getData(UserAttribute, whereChk);
      const walletType = wallet ? wallet : 'Main';
      //console.log("userRow ", userRow)
      const id = userRow.id
      //console.log("id ", id)
      const user_token = await this.db.fcm_notification.getFcmToken(id);
      //console.log("user_token ", user_token)
      const fcmTokens = user_token ? user_token.token : '';

      const addMoneyCount = await this.db.add_money.getCount(trans_no);
      if (addMoneyCount === 0) {
        const results = await this.insertMoneyData(user_id, amount, category, trans_no, filePath, walletType);

        if (results.id > 0) {

          if (fcmTokens.length > 0) {
            const notification = await notificationUtility.addMoneyRequestPendingNotification(fcmTokens, userRow.first_name, userRow.last_name, userRow.client_id);
            notification.user_id = id;
            //console.log("notification ", notification)
            await this.db.log_app_notification.insertData(notification);
          }

          return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: results })));
        } else {
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to insert data', data: [] })));
        }
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Already added money of that transaction no', data: [] })));
      }
    } catch (err) {
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Internal Server Error', data: [] })));

    }
  }

  async insertMoneyData(user_id, amount, category, trans_no, filePath, walletType) {

    const moneyData = {
      user_id,
      amount,
      category,
      trans_no,
      img: filePath,
      wallet: walletType
    };
    return await this.db.add_money.insertData(moneyData);
  }

  async addMoneyOrder(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, trans_amount, tran_sub_type, ip_address } = decryptedObject;

    const requiredKeys = Object.keys({ user_id, trans_amount, tran_sub_type, ip_address });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {
      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const order_id = utility.generateUniqueNumericAddMoney(6);


      const results = await this.db.sequelize.transaction(async (t) => {


        const newUpiAddMoney = await this.db.upi_order.create(
          {

            user_id,
            env: 'PROD',
            tran_type: 'Credit',
            tran_sub_type,
            tran_for: 'Add Money',
            trans_amount,
            currency: 'INR',
            order_id,
            order_status: 'PENDING',
            created_on,
            created_by: user_id,
            ip_address


          },
          { validate: true, transaction: t, logging: sql => logger.info(sql), }
        );
        return newUpiAddMoney;
      });



      if (results != null) {

        // const reference_no = '1' + String(insertedId).padStart(10, '0');

        //       const updateResult = await  this.db.upi_order.update(
        //           { reference_no: reference_no },
        //           { where: { order_id : order_id }, returning: true }
        //       );

        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: order_id })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed', data: [] })));


    } catch (err) {
      logger.error(`Unable to find : ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json();
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: err.message, data: [] })));
    }

  }

  async addMoneyRequestReport(req, res) {

    const { from_date, to_date } = req;

    try {

      let whereCondition;

      const startDate = new Date(from_date);
      const endDate = new Date(to_date);
      endDate.setHours(23, 59, 59);

      whereCondition = {

        'created_on': {
          [Op.between]: [startDate, endDate]
        },

      }


      const report = {
        totalAddmoneyCount: await this.db.add_money_view.count({ where: { ...whereCondition } }),
        totalPendingAddMoney: await this.db.add_money_view.count({ where: { ...whereCondition, status: 0 } }),
        totalApprovedaddMoney: await this.db.add_money_view.count({ where: { ...whereCondition, status: 1 } }),
        totalRejectedaddMoney_view: await this.db.add_money_view.count({ where: { ...whereCondition, status: 2 } }),
      }


      const result = await this.db.add_money_view.getAllData(whereCondition);

      const moneyResult = [];
      for (const item of result) {
        moneyResult.push({
          ...item.dataValues,
          img: baseurl + `uploads/add_money/` + item.img,
        });
      }

      return res.status(200).json({ status: 200, message: 'success', data: moneyResult, report });

    } catch (error) {
      logger.error(`Unable to find Result: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }

  async updateMoneyStatus(req, res, ipAddress) {
  console.log("📥 Incoming Request Body:", req.body);

  const { add_money_req_id, action, note, status } = req.body;

  const requiredKeys = Object.keys({ add_money_req_id, action, note, status });

  if (!requiredKeys.every(key => key in req.body && req.body[key] !== '' && req.body[key] !== undefined)) {
    console.log("❌ Missing Input Keys:", requiredKeys);
    return res.status(400).json({
      status: 400,
      message: 'Required input data is missing or empty',
      columns: requiredKeys
    });
  }

  let t;
  try {
    // ✅ Clean variable handling
    const noteValue = note && note.trim() !== '' ? note : 'Approve';
    const type = 'Credit';
    const finalStatus = (action === 'Approve') ? 1 : 2;
    const env = config.env;

    // ✅ Fetch Add Money request details
    const getMoneyRequestData = await this.db.add_money.getAddMoneyById(add_money_req_id);
    if (!getMoneyRequestData) {
      console.log("❌ No add money request found for ID:", add_money_req_id);
      return res.status(404).json({ status: 404, message: 'Add money request not found' });
    }

    const userId = getMoneyRequestData.user_id;
    const whereChk = { client_id: userId };
    const UserAttribute = ['id', 'first_name', 'last_name', 'mobile'];
    const userRow = await this.db.user.getData(UserAttribute, whereChk);

    const user_token = await this.db.fcm_notification.getFcmToken(userRow.id);
    const fcmTokens = user_token ? user_token.token : '';

    const currentDate = new Date();
    const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    const order_id = utility.generateUniqueNumeric(6);
    const amount = getMoneyRequestData.amount;
    const walletType = getMoneyRequestData.wallet;

    const data = {
      user_id: userId,
      env: 'PROD',
      tran_type: type,
      tran_sub_type: 'MANUAL ORDER',
      tran_for: 'Add Money',
      trans_amount: amount,
      currency: 'INR',
      order_id,
      order_status: 'SUCCESS',
      created_on,
      created_by: userId,
      ip_address: ipAddress
    };

    const newUpiAddMoney = await this.db.upi_order.insertData(data);

    let walletEntry = [];
    if (newUpiAddMoney && newUpiAddMoney.id && action === 'Approve') {

      if (walletType === 'Main') {
        const walletData = {
          transaction_id: order_id,
          user_id: userId,
          env: env,
          type: type,
          amount: amount,
          sub_type: 'Add Money',
          tran_for: 'main'
        };
        walletEntry = await this.db.wallet.insert_wallet(walletData);
      }

      if (walletType === 'Epin') {
        let bonus_amount = 0;
        const bonusPoints = [
          { threshold: 5000, points: 250 },
          { threshold: 10000, points: 500 },
          { threshold: 15000, points: 750 },
          { threshold: 20000, points: 1000 }
        ];

        for (const { threshold, points } of bonusPoints) {
          if (amount == threshold) bonus_amount = points;
        }

        const ewalletData = {
          transaction_id: order_id,
          user_id: userId,
          env: env,
          type: type,
          amount: amount,
          sub_type: 'Add Money',
          tran_for: 'epin'
        };

        walletEntry = await this.db.epinWallet.insert_wallet(ewalletData);

        if (parseInt(amount) >= 5000 && bonus_amount > 0) {
          const neworder_id = utility.generateUniqueNumeric(6);
          const bonusData = {
            user_id: userId,
            env: 'PROD',
            tran_type: type,
            tran_sub_type: 'MANUAL ORDER',
            tran_for: 'Add Money Bonus',
            trans_amount: bonus_amount,
            currency: 'INR',
            order_id: neworder_id,
            order_status: 'SUCCESS',
            created_on,
            created_by: userId,
            ip_address: ipAddress
          };

          await this.db.upi_order.insertData(bonusData);

          const ewalletBonusData = {
            transaction_id: neworder_id,
            user_id: userId,
            env: env,
            type: type,
            amount: bonus_amount,
            sub_type: 'Add Money Bonus',
            tran_for: 'epin'
          };

          await this.db.epinWallet.insert_wallet(ewalletBonusData);
        }
      }
    }

    if (walletEntry && walletEntry.error !== undefined && walletEntry.error === 0) {
      const passbookData = {
        transaction_id: order_id,
        user_id: userId,
        env: env,
        type: type,
        amount: amount,
        tran_for: 'Add Money',
        ref_tbl_id: walletEntry.createdId
      };

      await this.db.passbook.insert_passbook(passbookData);

      await this.db.upi_order.update(
        { order_status: 'SUCCESS' },
        { where: { user_id: userId, order_id: order_id, order_status: 'PENDING' } }
      );
    }

    if (walletEntry) {
      const updatedMoneyStatus = await this.db.add_money.UpdateData(
        {
          rejection_reason: noteValue,
          status: finalStatus,
          updated_on: created_on
        },
        add_money_req_id
      );

      if (updatedMoneyStatus > 0) {
        if (action === 'Approve' && finalStatus === 1) {
          if (fcmTokens.length > 0) {
            const notification = await notificationUtility.addMoneyRequestApprovedNotification(
              fcmTokens,
              userRow.first_name,
              userRow.last_name,
              userRow.id
            );
            await this.db.log_app_notification.insertData(notification);
          }
        } else {
          if (fcmTokens.length > 0) {
            const notification = await notificationUtility.addMoneyRequestRejectNotification(
              fcmTokens,
              userRow.first_name,
              userRow.last_name,
              userRow.id
            );
            await this.db.log_app_notification.insertData(notification);
          }
        }

        console.log("✅ Response: Money Request Successful");
        return res.status(200).json({
          status: 200,
          message: 'Money Request Successful.',
          data: walletEntry
        });
      } else {
        console.log("❌ Response: Failed to insert data");
        return res.status(500).json({ status: 500, message: 'Failed to insert data', data: [] });
      }
    }

  } catch (error) {
    logger.error(`❌ Error in updateMoneyStatus: ${error}`);
    console.error("❌ Exception:", error);

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err) => err.message);
      console.log("⚠️ Validation Errors:", validationErrors);
      return res.status(500).json({ status: 500, errors: validationErrors });
    }

    return res.status(500).json({ status: 500, message: error.message || error, data: [] });
  }
}


  async addMoneyRequestHistory(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, wallet } = decryptedObject;
    const requiredKeys = Object.keys({ user_id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    try {
      const walletType = wallet ? wallet : 'Main';

      let whereCondition;
      whereCondition = {
        user_id: user_id,
        wallet: walletType
      }


      const result = await this.db.add_money_view.getAllData(whereCondition);

      const moneyResult = [];
      for (const item of result) {
        moneyResult.push({
          ...item.dataValues,
          img: baseurl + `uploads/add_money/` + item.img,
        });
      }

      return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'success', data: moneyResult })));
      // return res.status(200).json({ status: 200,  message:'success', data : moneyResult });

    } catch (error) {
      logger.error(`Unable to find Result: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
        // return res.status(500).json({ status: 500,errors: validationErrors });
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));
      //   return res.status(500).json({ status: 500,  message: error.message ,data:[]});
    }
  }

}

module.exports = new AddMoney();