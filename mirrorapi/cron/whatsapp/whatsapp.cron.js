const { connect } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const whatsappUtility = require('../../utility/whatsapp.utility');
const fs = require('fs');
const axios = require('axios');

class cronJobWhatsapp {

  db = {};

  constructor() {

    this.logFilePath = 'cron.log';

    this.db = connect();
  }

  async getWhatsappSeting() {
    return await this.db.whatsapp_setting.findOne({
      where: {
        status: 1
      },
      order: [['id', 'DESC']]
    })
  }


  async RegisterWhatappJob() {

    try {
      const service = 'Register'
      const rawQuery = `
              SELECT tbl_app_users.* FROM tbl_app_users
               LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_app_users.id 
              AND log_whatsapp_notification.service='${service}' 
              AND CAST(log_whatsapp_notification.entry_datetime AS DATE)=CURRENT_DATE
              WHERE CAST(tbl_app_users.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const referred_by = item.referred_by;
        const message = await whatsappUtility.registerWhatsappMessage(first_name, last_name, mobile);
        const media_url = null;
        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            entry_datetime: entryDate,
            status: resStatus,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }

        if (referred_by > 0) {
          const where = { id: referred_by };
          const Attr = ['id', 'first_name', 'last_name', 'mlm_id', 'mobile'];
          const userData = await this.db.user.getData(Attr, where);
          if (userData) {
            const refer_user_id = userData.id;
            const refer_mobile = userData.mobile;
            const refer_first_name = userData.first_name;
            const refer_last_name = userData.last_name;
            const refer_mlm_id = userData.mlm_id;
            const refer_message = await whatsappUtility.referralUserMessage(refer_first_name, refer_last_name, first_name, last_name, refer_mobile, refer_mlm_id);
            const refer_media_url = null;
            const refer_responseData = await whatsappUtility.ApiWhatsappMsg(refer_mobile, refer_message, refer_media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

            if (refer_responseData.status) {
              let ref_resStatus = 2;
              if (refer_responseData.status == 'success') { ref_resStatus = 1; }
              const ref_notificationLog = {
                mobile: refer_mobile,
                message: refer_message,
                status: ref_resStatus,
                entry_datetime: entryDate,
                updated_datetime: Date.now(),
                user_id: refer_user_id,
                service: 'Referral'
              }
              await this.insertDataIfNotExists(notificationLog);
            }
          }

        }
      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async LoginWhatappJob() {

    try {
      const service = 'Login'
      const rawQuery = `
              SELECT log_user_service.*, first_name,last_name,tbl_app_users.mobile,email, district FROM log_user_service
              JOIN tbl_app_users ON log_user_service.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_app_users.id 
              AND log_whatsapp_notification.service='${service}' 
              AND log_whatsapp_notification.entry_datetime=log_user_service.created_on
              WHERE CAST(log_user_service.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
              AND log_user_service.service_type='${service}'
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const address = item.district;
        const message = await whatsappUtility.loginWhatsappMessage(first_name, last_name, address, mobile);
        const media_url = null;
        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {

          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }

      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async ForgotPasswordWhatappJob() {

    try {
      const service = 'Forgot Password'
      const rawQuery = `
              SELECT log_user_service.*,first_name,last_name,tbl_app_users.mobile,email FROM log_user_service
              JOIN tbl_app_users ON log_user_service.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_app_users.id 
              AND log_whatsapp_notification.service='${service}' 
              AND log_whatsapp_notification.entry_datetime=log_user_service.created_on
              AND CAST(log_whatsapp_notification.entry_datetime AS DATE)=CURRENT_DATE
              WHERE CAST(log_user_service.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
              AND log_user_service.service_type='${service}'
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.forgotPasswordMessage(first_name, last_name, mobile);
        const media_url = null;
        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }

      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async RechargeWhatappJob() {

    try {
      const service = 'Recharge'
      const rawQuery = `
              SELECT view_recharge.* FROM view_recharge
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=view_recharge.user_id 
                AND log_whatsapp_notification.service='${service}' 
                AND log_whatsapp_notification.entry_datetime=view_recharge.created_on
                AND log_whatsapp_notification.transaction_id=view_recharge.transaction_id
              WHERE CAST(view_recharge.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const ConsumerNumber = item.ConsumerNumber;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const cashback_amount = item.service_amount ? item.service_amount : item.cashback_amount;
        const main_amount = item.main_amount;
        const tranx_id = item.reference_no;
        const transaction_id = item.transaction_id;
        let message = '';

        if (item.recharge_status == 'SUCCESS' || item.recharge_status == 'PROCESS') {
          message = await whatsappUtility.rechargeSuccessMessage(first_name, last_name, mobile, cashback_amount, main_amount, ConsumerNumber, tranx_id);
        }

        if (item.recharge_status == 'FAILURE') {
          message = await whatsappUtility.rechargeFailedMessage(first_name, last_name, mobile, main_amount, ConsumerNumber);
        }

        const media_url = null;

        if (message) {
          const whatsapp_setting = await this.getWhatsappSeting();
          const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

          if (responseData.status) {
            let resStatus = 2;
            if (responseData.status == 'success') { resStatus = 1; }
            const notificationLog = {
              mobile,
              message,
              status: resStatus,
              entry_datetime: entryDate,
              updated_datetime: Date.now(),
              user_id,
              service: service,
              transaction_id: transaction_id
            }
            await this.insertDataIfNotExists(notificationLog);
          }
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AddMoneyRequestPendingWhatappJob() {

    try {
      const service = 'Add Money Pending'
      const rawQuery = `
              SELECT trans_add_money_request.*,
                first_name,
                last_name,
                mlm_id,
                tbl_app_users.mobile
              FROM trans_add_money_request
              JOIN tbl_app_users ON trans_add_money_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_add_money_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_add_money_request.created_on
              WHERE CAST(trans_add_money_request.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_add_money_request.status=0
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const message = await whatsappUtility.addMoneyRequestPendingMessage(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async AddMoneyRequestApprovedWhatappJob() {

    try {
      const service = 'Add Money Approved'
      const rawQuery = `
              SELECT trans_add_money_request.*,
                first_name,
                last_name,
                mlm_id,
                tbl_app_users.mobile
              FROM trans_add_money_request
              JOIN tbl_app_users ON trans_add_money_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_add_money_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_add_money_request.updated_on
              WHERE CAST(trans_add_money_request.updated_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_add_money_request.status=1
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.updated_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const message = await whatsappUtility.addMoneyRequestApprovedMessage(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AddMoneyRequestRejectWhatappJob() {

    try {
      const service = 'Add Money Rejected'
      const rawQuery = `
              SELECT trans_add_money_request.*,
                first_name,
                last_name,
                mlm_id,
                tbl_app_users.mobile
              FROM trans_add_money_request
              JOIN tbl_app_users ON trans_add_money_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_add_money_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_add_money_request.updated_on
              WHERE CAST(trans_add_money_request.updated_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_add_money_request.status=2
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.updated_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const reject_reason = item.rejection_reason;
        const message = await whatsappUtility.addMoneyRequestRejectMessage(first_name, last_name, mobile, amount, reject_reason);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async InsuranceRequestWhatappJob() {

    try {
      const service = 'Insurance'
      const rawQuery = `
              SELECT view_insurance.*
              FROM view_insurance
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=view_insurance.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=view_insurance.created_on
              WHERE CAST(view_insurance.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.insuranceRequestMessage(first_name, last_name, mobile);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async SendmoneyWhatappJob() {

    try {
      const service = 'Send Money'
      const rawQuery = `
              SELECT view_send_money.*,STR_TO_DATE(view_send_money.created_on, '%a, %d %M %Y %H:%i:%s') as entry_date,
              tbl_app_users.first_name as sender_first_name,
              tbl_app_users.last_name as sender_last_name,
              tbl_app_users.mobile as sender_mobile
              FROM view_send_money
              JOIN tbl_app_users ON view_send_money.from_user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=view_send_money.from_user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=STR_TO_DATE(view_send_money.created_on, '%a, %d %M %Y %H:%i:%s')
              WHERE CAST(STR_TO_DATE(view_send_money.created_on, '%a, %d %M %Y %H:%i:%s') AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.entry_date);
        const user_id = item.from_user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const sender_first_name = item.sender_first_name;
        const sender_last_name = item.sender_last_name;
        const sender_mobile = item.sender_mobile;
        const amount = item.amount;
        const message = await whatsappUtility.sendMoneyMessagetoUser(first_name, last_name, mobile, sender_first_name, sender_last_name, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        const senderMessage = await whatsappUtility.sendMoneyMessageSender(first_name, last_name, mobile, sender_first_name, sender_last_name, amount);
        await whatsappUtility.ApiWhatsappMsg(sender_mobile, senderMessage, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);

        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async KycApproveWhatappJob() {

    try {
      const service = 'KYC Approve'
      const rawQuery = `
              SELECT tbl_kyc.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM tbl_kyc
              JOIN tbl_app_users ON tbl_kyc.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_kyc.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=tbl_kyc.modified_on
              WHERE CAST(tbl_kyc.modified_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null and tbl_kyc.status=1
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.modified_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.kycApprovedMessage(first_name, last_name, mobile);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async KycRejectWhatappJob() {

    try {
      const service = 'KYC Reject'
      const rawQuery = `
              SELECT tbl_kyc.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM tbl_kyc
              JOIN tbl_app_users ON tbl_kyc.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_kyc.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=tbl_kyc.modified_on
              WHERE CAST(tbl_kyc.modified_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null and tbl_kyc.status=2
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.modified_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const rejection_reason = item.rejection_reason;
        const message = await whatsappUtility.kycRejectMessage(first_name, last_name, mobile, rejection_reason);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async KycRequestWhatappJob() {

    try {
      const service = 'KYC Request'
      const rawQuery = `
              SELECT tbl_kyc.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM tbl_kyc
              JOIN tbl_app_users ON tbl_kyc.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_kyc.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=tbl_kyc.created_on
              WHERE CAST(tbl_kyc.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null and tbl_kyc.status=0
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.kycRequestMessage(first_name, last_name, mobile);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AddMoneyWhatappJob() {

    try {
      const service = 'Add Money'
      const rawQuery = `
              SELECT tbl_wallet.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM tbl_wallet
              JOIN tbl_app_users ON tbl_wallet.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_wallet.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=tbl_wallet.created_on
              WHERE CAST(tbl_wallet.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND sub_type='${service}'
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });
      let test1 = [];
      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.credit;
        const transaction_id = item.transaction_id;
        const message = await whatsappUtility.addMoney(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id: transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }
      return test1;

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AddmoneyFailWhatappJob() {

    try {
      const service = 'Add Money Fail'
      const rawQuery = `
              SELECT trans_order_generate.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM trans_order_generate
              JOIN tbl_app_users ON trans_order_generate.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_order_generate.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_order_generate.created_on 
                AND log_whatsapp_notification.transaction_id=trans_order_generate.order_id
              LEFT JOIN tbl_wallet ON tbl_wallet.user_id=trans_order_generate.user_id and trans_order_generate.order_id=tbl_wallet.transaction_id
              WHERE CAST(trans_order_generate.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_order_generate.tran_for='Add Money' 
              AND trans_order_generate.order_status!='SUCCESS' AND tbl_wallet.id is null
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.trans_amount;
        const transaction_id = item.order_id;
        const message = await whatsappUtility.addmoney_fail(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id: transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async RedeemRequestWhatappJob() {

    try {
      const service = 'Redeem Request'
      const rawQuery = `
              SELECT trans_redeem_request.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM trans_redeem_request
              JOIN tbl_app_users ON trans_redeem_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_redeem_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_redeem_request.created_on
              WHERE CAST(trans_redeem_request.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_redeem_request.status=0 
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const transaction_id = item.trans_no;
        const message = await whatsappUtility.redeem_request(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id: transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async RedeemRejectWhatappJob() {

    try {
      const service = 'Redeem Reject'
      const rawQuery = `
              SELECT trans_redeem_request.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM trans_redeem_request
              JOIN tbl_app_users ON trans_redeem_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_redeem_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_redeem_request.updated_on
              WHERE CAST(trans_redeem_request.updated_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_redeem_request.status=2 
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.updated_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const transaction_id = item.trans_no;
        const remarks = item.approval_remarks;
        const message = await whatsappUtility.redeem_reject(first_name, last_name, mobile, amount, remarks);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id: transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async RedeemApproveWhatappJob() {

    try {
      const service = 'Redeem Approve'
      const rawQuery = `
              SELECT trans_redeem_request.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM trans_redeem_request
              JOIN tbl_app_users ON trans_redeem_request.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=trans_redeem_request.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=trans_redeem_request.updated_on
              WHERE CAST(trans_redeem_request.updated_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND trans_redeem_request.status=1 
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.updated_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const amount = item.amount;
        const transaction_id = item.trans_no;
        const message = await whatsappUtility.redeem_approve(first_name, last_name, mobile, amount);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id: transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async FeedbackWhatappJob() {

    try {
      const service = 'Feedback'
      const rawQuery = `
              SELECT tbl_feedback_report.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM tbl_feedback_report
              JOIN tbl_app_users ON tbl_feedback_report.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=tbl_feedback_report.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=tbl_feedback_report.created_on
              WHERE CAST(tbl_feedback_report.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND tbl_feedback_report.status=3 
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.feedback(first_name, last_name);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AdminIncomeWhatappJob() {

    try {
      const service = 'Admin Income'
      const rawQuery = `
              SELECT log_system_credit_debit.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM log_system_credit_debit
              JOIN tbl_app_users ON log_system_credit_debit.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=log_system_credit_debit.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=log_system_credit_debit.created_on
              WHERE CAST(log_system_credit_debit.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null AND log_system_credit_debit.transaction_type='Credit'
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const wallet_type = item.wallet_type;
        const amount = item.amount;
        const message = await whatsappUtility.admin_incomecredit(first_name, last_name, amount, wallet_type);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async PrimePurchaseWhatappJob() {

    try {
      const service = 'Prime Purchase'
      const rawQuery = `
              SELECT view_prime_user_report.*
              FROM view_prime_user_report
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=view_prime_user_report.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=view_prime_user_report.created_on 
                AND log_whatsapp_notification.transaction_id=view_prime_user_report.transaction_id
              WHERE CAST(view_prime_user_report.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null 
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const name = item.name;
        const plan = item.plan;
        const transaction_id = item.transaction_id;
        const message = await whatsappUtility.prime_purchase(name, plan);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service,
            transaction_id
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }


  async AutoIdBlockWhatappJob() {

    try {
      const service = 'User Id Block'
      const rawQuery = `
              SELECT log_user_mpin_details.*,
              tbl_app_users.first_name,
              tbl_app_users.last_name,
              tbl_app_users.mobile
              FROM log_user_mpin_details
              JOIN tbl_app_users ON log_user_mpin_details.user_id=tbl_app_users.id
              LEFT JOIN log_whatsapp_notification ON log_whatsapp_notification.user_id=log_user_mpin_details.user_id 
                AND log_whatsapp_notification.service='${service}'
                AND log_whatsapp_notification.entry_datetime=log_user_mpin_details.created_on 
              WHERE CAST(log_user_mpin_details.created_on AS DATE)=CURRENT_DATE AND log_whatsapp_notification.id is null 
              AND log_user_mpin_details.status=0 and log_user_mpin_details.action like '%account%'
            `;

      const results = await this.db.sequelize.query(rawQuery, {
        type: this.db.sequelize.QueryTypes.SELECT,
      });

      for (const item of results) {
        const entryDate = new Date(item.created_on);
        const user_id = item.user_id;
        const mobile = item.mobile;
        const first_name = item.first_name;
        const last_name = item.last_name;
        const message = await whatsappUtility.id_autoblock(first_name, last_name);
        const media_url = null;

        const whatsapp_setting = await this.getWhatsappSeting();
        const responseData = await whatsappUtility.ApiWhatsappMsg(mobile, message, media_url, whatsapp_setting.instance_id, whatsapp_setting.access_token);


        if (responseData.status) {
          let resStatus = 2;
          if (responseData.status == 'success') { resStatus = 1; }
          const notificationLog = {
            mobile,
            message,
            status: resStatus,
            entry_datetime: entryDate,
            updated_datetime: Date.now(),
            user_id,
            service: service
          }
          await this.insertDataIfNotExists(notificationLog);
        }


      }

    } catch (err) {
      console.error('Error in sending Whatsappjob :', err);
    }
  }

  async insertDataIfNotExists(notificationLog) {
    const { user_id, service, transaction_id, entry_datetime } = notificationLog;

    const exists = await this.db.whatsapp_notification.findOne({
      where: {
        user_id,
        service,
        transaction_id: transaction_id || null,
        entry_datetime: this.db.sequelize.where(
          this.db.sequelize.fn('DATE', this.db.sequelize.col('entry_datetime')),
          '=',
          this.db.sequelize.fn('DATE', entry_datetime)
        )
      }
    });

    if (!exists) {
      await this.db.whatsapp_notification.insertData(notificationLog);
      return true;
    }
    return false;
  }


}


module.exports = new cronJobWhatsapp();
