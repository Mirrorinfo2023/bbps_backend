const { connect, baseurl } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper'); 
const pino = require('pino');
// const logger = pino({ level: 'info' }, process.stdout);
require('dotenv').config();
// const baseUrl = process.env.API_BASE_URL ;
const utility = require('../../utility/utility');
const whatsappUtility = require('../../utility/whatsapp.utility');
const messagingService = require('../../router/whatsapp/messagingService');
const uploadFileToB2 = require("../../utility/b2Upload.utility");
const emailUtility = require("../../utility/email.utility")
class Kyc {

  db = {};

  constructor() {
    this.db = connect();

  }

  async uploadKyc(files, reqBody) {
    let t;
    const {
      user_id,
      pan_number,
      aadhar_number,
      account_number,
      account_holder,
      bank_name,
      ifsc_code,
      nominee_name,
      nominee_relation,
      full_address,
    } = reqBody;

    console.log("userid: ", user_id)
    // Required field validation
    const requiredKeys = [
      "user_id",
      "pan_number",
      "aadhar_number",
      "account_number",
      "account_holder",
      "bank_name",
      "ifsc_code",
      "nominee_name",
      "nominee_relation",
      "full_address",
    ];
    if (!requiredKeys.every((key) => reqBody[key])) {
      return {
        status: 400,
        message: "Required input data is missing or empty",
        columns: requiredKeys,
      };
    }

    try {
      t = await this.db.sequelize.transaction();

      // ✅ Check if user already has active KYC
      const existingKyc = await this.db.kyc.findOne({
        where: { user_id, status: 1 },
      });
      console.log("existingKyc: ", existingKyc)
      if (existingKyc) {
        await t.rollback();
        return { status: 400, message: "KYC already exists for this user" };
      }
      // ✅ Only now upload files to B2
      const [panUpload, aadharUpload, aadharBackUpload, checkbookUpload] =
        await Promise.all([
          uploadFileToB2.uploadKycFile(files["panImage"]?.[0], user_id),
          uploadFileToB2.uploadKycFile(files["aadharImage"]?.[0], user_id),
          uploadFileToB2.uploadKycFile(files["aadharBackImage"]?.[0], user_id),
          uploadFileToB2.uploadKycFile(files["chequeBookImage"]?.[0], user_id),
        ]);

      //  console.log("panUpload: ",panUpload)
      //  console.log("aadharUpload: ",aadharUpload)
      //  console.log("aadharBackUpload: ",aadharBackUpload)
      console.log("checkbookUpload: ", checkbookUpload)

      // ✅ Generate signed/private URLs (parallel)
      const [panImage, aadharImage, aadharBackImage, checkbookImage] =
        await Promise.all([
          uploadFileToB2.getPrivateFileUrl(
            { fileName: panUpload.fileName },
            7 * 24 * 60 * 60
          ),
          uploadFileToB2.getPrivateFileUrl(
            { fileName: aadharUpload.fileName },
            7 * 24 * 60 * 60
          ),
          uploadFileToB2.getPrivateFileUrl(
            { fileName: aadharBackUpload.fileName },
            7 * 24 * 60 * 60
          ),
          uploadFileToB2.getPrivateFileUrl(
            { fileName: checkbookUpload.fileName },
            7 * 24 * 60 * 60
          ),
        ]);

      console.log("checkbookImage: ", checkbookImage)
      // ✅ Insert KYC record in DB
      const kycData = {
        user_id,
        pan_number,
        aadhar_number,
        account_number,
        account_holder,
        bank_name,
        ifsc_code,
        nominee_name,
        nominee_relation,
        panImage,
        aadharImage,
        aadharBackImage,
        checkbookImage,
        created_by: user_id,
        status: 0, // pending
        address: full_address,
      };

      const newKyc = await this.db.kyc.insertData(kycData, {
        validate: true,
        transaction: t,
      });

      console.log("KYC uploaded successfully", newKyc.user_id)

      await t.commit();
      return {
        status: 200,
        message: "KYC uploaded successfully",
        data: newKyc,
      };
    } catch (error) {
      if (t) await t.rollback();
      console.error("KYC Upload Error:", error);
      return { status: 500, message: "Failed to create", error: error.message };
    }
  }





  // async uploadKyc(panImage, aadharImage, aadharBackImage, chequeBookImage, req) {
  //   let t;
  //   const {
  //     pan_number, aadhar_number, account_number, account_holder,
  //     bank_name, ifsc_code, nominee_name, nominee_relation, full_address
  //   } = req.body;

  //  const user_id = req.user?.id;
  //   // Check required fields

  //   const requiredKeys = Object.keys({  pan_number, aadhar_number, account_number, account_holder, bank_name, ifsc_code, nominee_name, nominee_relation, full_address });
  //   if (!requiredKeys.every(key => reqBody[key])) {
  //     return { status: 400, message: "Required input data is missing or empty", columns: requiredKeys };
  //   }

  //   try {
  //     t = await this.db.sequelize.transaction();

  //     const existingKyc = await this.db.kyc.findOne({ where: { user_id, status: 1 } });
  //     if (existingKyc) {
  //       await t.rollback();
  //       return { status: 500, error: "Already Exist" };
  //     }

  //     const panFile = panImage ? await kycService.uploadKycImage(user_id, panImage) : null;
  //     const aadharFile = aadharImage ? await kycService.uploadKycImage(user_id, aadharImage) : null;
  //     const aadharBackFile = aadharBackImage ? await kycService.uploadKycImage(user_id, aadharBackImage) : null;
  //     const chequeFile = chequeBookImage ? await kycService.uploadKycImage(user_id, chequeBookImage) : null;

  //     // Save URLs in DB
  //     const kycData = {
  //       user_id, pan_number, aadhar_number, account_number, account_holder,
  //       bank_name, ifsc_code, nominee_name, nominee_relation,
  //       panImage: panFile?.downloadUrl,
  //       aadharImage: aadharFile?.downloadUrl,
  //       aadharBackImage: aadharBackFile?.downloadUrl,
  //       checkbookImage: chequeFile?.downloadUrl,
  //       created_by: user_id, status: 0, address: full_address,
  //     };

  //     const newKyc = await this.db.kyc.insertData(kycData, { validate: true, transaction: t });
  //     await t.commit();
  //     return { status: 200, message: "KYC done successfully", data: newKyc };

  //   } catch (error) {
  //     if (t) await t.rollback();
  //     return { status: 500, message: "Failed to create", error: error.message };
  //   }
  // }


  async getKyc(req, res) {

    let t;
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id } = decryptedObject;

    try {

      const userId = user_id;
      const existingKyc = await this.db.kyc.getKycData({ user_id: userId });

      if (existingKyc) {
        // return res.status(200).json({ status: 200, message: 'Get KYC successfully', data: existingKyc });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Get KYC successfully', data: existingKyc })));
      } else {
        // return res.status(200).json({ status: 200, error: 'KYC Not Done' });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, error: 'KYC Not Done' })));
      }
    } catch (error) {

      logger.error(`Error in upload KYC: ${error}`);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
      }

      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to create', data: [] })));

    }

  }




  async getKycReport_old(req, res) {

    let t;

    try {


      const existingKyc = await this.db.kyc.getAllData();

      if (existingKyc) {

        const kycResult = await Promise.all(existingKyc.map(async item => {

          const userdata = await this.db.user.getDataExistingUser(['first_name', 'last_name', 'mlm_id', 'mobile'], { id: item.user_id })

          return {

            name: userdata.first_name + ' ' + userdata.last_name,
            mlm_id: userdata.mlm_id,
            mobile: userdata.mobile,
            ...item.dataValues,
            panImage: item.panImage == null ? '' : baseurl + item.panImage,
            aadharImage: item.aadharImage == null ? '' : baseurl + item.aadharImage,
            aadharBackImage: item.aadharBackImage == null ? '' : baseurl + item.aadharBackImage,
            checkbookImage: item.checkbookImage == null ? '' : baseurl + item.checkbookImage,

          };
        }));



        return res.status(200).json({ status: 200, message: 'Get KYC successfully', data: kycResult });
      } else {
        return res.status(200).json({ status: 200, error: 'KYC Not Done' });
      }
    } catch (error) {

      logger.error(`Error in upload KYC: ${error}`);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: 'Failed to create', data: [] });
    }

  }


  async getKycReport(req, res) {
    const { from_date, to_date } = req; // ✅ coming from frontend

    try {
      // Build date range
      const startDate = `${from_date} 00:00:00`;
      const endDate = `${to_date} 23:59:59`;

      // Fetch KYC records (clean JSON because of raw: true)
      const existingKyc = await this.db.kyc.findAll({
        where: {
          created_on: {
            [Op.between]: [startDate, endDate],
          },
        },
        attributes: [
          'id',
          'user_id',
          'pan_number',
          'aadhar_number',
          'aadharImage',
          'status',
          'panImage',
          'checkbookImage',
          'account_number',
          'account_holder',
          'ifsc_code',
          'nominee_name',
          'nominee_relation',
          'aadharBackImage',
          'bank_name',
          'address',
          'rejection_reason',
          [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on'],
          [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
        ],
        order: [['created_on', 'DESC'], ['status', 'ASC']],
        raw: true, // ✅ makes Sequelize return plain JSON objects
      });

      if (!existingKyc.length) {
        return res.status(200).json({ status: 200, error: 'KYC Not Done' });
      }

      // Enrich data with user info
      const kycResult = await Promise.all(
        existingKyc.map(async (item) => {
          const userdata = await this.db.user.getDataExistingUser(
            ['first_name', 'last_name', 'mlm_id', 'mobile'],
            { id: item.user_id }
          );

          return {
            name: userdata ? userdata.first_name + ' ' + userdata.last_name : '',
            mlm_id: userdata?.mlm_id || '',
            mobile: userdata?.mobile || '',
            ...item,
            panImage: item.panImage ? item.panImage : '',
            aadharImage: item.aadharImage ? item.aadharImage : '',
            aadharBackImage: item.aadharBackImage ? item.aadharBackImage : '',
            checkbookImage: item.checkbookImage ? item.checkbookImage : '',
          };
        })
      );

      // Summary report
      const report = {
        totalKyc: await this.db.kyc.count(),
        totalPendingKyc: await this.db.kyc.count({ where: { status: 0 } }),
        totalApprovedKyc: await this.db.kyc.count({ where: { status: 1 } }),
        totalRejectedKyc: await this.db.kyc.count({ where: { status: 2 } }),
      };

      console.log("kycResult", kycResult)
      return res.status(200).json({
        status: 200,
        message: 'Get KYC successfully',
        data: kycResult,
        report,
      });
    } catch (error) {
      logger.error(`Error in getKycReport: ${error}`);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({
        status: 500,
        message: 'Failed to fetch KYC',
        data: [],
      });
    }
  }


  async updateKycStatus(req, res) {
    const { id, action, note } = req.body;

    console.log("🔹 Incoming request body:", req.body);

    if (!id || !action) {
      console.log("❌ Validation failed: id or action missing");
      return res.status(400).json({
        status: 400,
        message: "Validation error",
        errors: ["id and action are required"]
      });
    }

    try {
      console.log("🔍 Fetching user by KYC id:", id);
      const user = await this.getUserFromKycId(id);

      console.log("👤 User fetched:", user);

      if (!user) {
        console.log("❌ No user found for KYC id:", id);
        return res.status(404).json({
          status: 404,
          message: "User not found",
          errors: [`No user linked with KYC id ${id}`]
        });
      }

      let rejection_reason = null;
      let status = 0;
      let message, emailMsg;

      if (action === "Reject") {
        console.log("🚫 Action: Reject");
        rejection_reason = note || "Rejected by admin";
        status = 2;
        message = await whatsappUtility.kycRejectMessage(
          user.first_name,
          user.last_name,
          user.mobile,
          rejection_reason
        );
        emailMsg = await emailUtility.kycRejectEmailMessage(
          user.first_name,
          user.last_name,
          user.mobile,
          rejection_reason
        );
      } else if (action === "Approve") {
        console.log("✅ Action: Approve");
        rejection_reason = null;
        status = 1;
        message = await whatsappUtility.kycApprovedMessage(
          user.first_name,
          user.last_name,
          user.mobile
        );
        emailMsg = await emailUtility.kycApprovedEmailMessage(
          user.first_name,
          user.last_name,
          user.mobile
        );
      } else {
        console.log("❌ Invalid action:", action);
        return res.status(400).json({
          status: 400,
          message: "Validation error",
          errors: ["Invalid action. Use Approve or Reject"]
        });
      }

      const modified_on = new Date().toISOString().slice(0, 19).replace("T", " ");
      console.log("🕒 Modified timestamp:", modified_on);

      console.log("💾 Updating KYC record in DB...");
      const updated = await this.db.kyc.updateData(
        { rejection_reason, status, modified_on },
        { id }
      );
      console.log("🔄 DB update result:", updated);

      if (updated) {
        console.log("📩 Sending notifications (WhatsApp & Email)...");
        messagingService.sendMessage(
          user.mobile,
          message,
          null,
          user.email,
          "KYC Status Update Alert",
          emailMsg
        );

        console.log("✅ KYC update success for user:", user.id || user.user_id);
        return res.status(200).json({
          status: 200,
          message: "KYC Updated Successfully"
        });
      } else {
        console.log("❌ DB update failed for KYC id:", id);
        return res.status(500).json({
          status: 500,
          message: "Database update failed",
          errors: [`Failed to update KYC record with id ${id}`]
        });
      }

    } catch (error) {
      console.error("🔥 Error while updating KYC:", error);
      return res.status(500).json({
        status: 500,
        message: "Internal server error",
        errors: [error.message]
      });
    }
  }







  async updateKyc(req, res) {

    const { kyc_id, user_id, pan, aadhar_number, account_number, account_holder, ifsc_code, nominee_name, nominee_relation, address, bank_name, status } = req;

    const requiredKeys = Object.keys({ kyc_id, user_id, pan, aadhar_number, account_number, account_holder, ifsc_code, nominee_name, nominee_relation, address });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {

      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const updatedMoneyStatus = await this.db.kyc.UpdateData(
        {
          pan_number: pan,
          aadhar_number,
          account_number,
          account_holder,
          ifsc_code,
          nominee_name,
          nominee_relation,
          address,
          bank_name,
          status,
          modified_on: created_on
        },
        { user_id: user_id, id: kyc_id }

      );

      if (updatedMoneyStatus) {
        return res.status(200).json({ status: 200, message: 'KYC Updated Successful.' });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
  }

  async getUserFromKycId(id) {
    console.log("➡️ Looking up KYC by id:", id);

    // First fetch the KYC record
    const kycRecord = await this.db.kyc.findOne({
      where: { id },
      attributes: ["user_id"]
    });

    console.log("✅ KYC record found:", kycRecord ? kycRecord.toJSON() : null);

    if (!kycRecord) {
      console.log("❌ No KYC found for this id:", id);
      return null;
    }

    // Then fetch the user linked to that KYC
    const userRecord = await this.db.user.findOne({
      where: { id: kycRecord.user_id },
      attributes: ["id", "first_name", "last_name", "mobile", "email"]
    });

    console.log("✅ User record found:", userRecord ? userRecord.toJSON() : null);

    return userRecord ? userRecord.get({ plain: true }) : null;
  }


}



module.exports = new Kyc();