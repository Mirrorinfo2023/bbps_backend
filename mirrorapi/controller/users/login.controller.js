const { connect, config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utility = require('../../utility/utility');
const userUtility = require('../../utility/user.utility');
//const helper = require('../utility/helper'); 
const whatsappUtility = require('../../utility/whatsapp.utility');
const notificationUtility = require('../../utility/fcm_notification.utitlity');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const recaptchaUtility = require('../../utility/recaptcha.utility');
const messagingService = require('../../router/whatsapp/messagingService');
const emailUtility = require('../../utility/email.utility');


class Login {

  db = {};

  constructor() {
    this.db = connect();
    console.log('DB Object:', this.db);
  }



  async login(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { username, password } = decryptedObject;



    try {

      const getUserSearchByData = { username, mobile: username, mlm_id: username, email: username }
      const userRow = await this.db.user.getUserSearchByDataWithORStatus(getUserSearchByData);

      if (!userRow) {
        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'User not found', data: [] })));
      }


      if (userRow.status == 0) {
        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'You are temporarily blocked. Please contact the Support Team at 9112421742.', data: [] })));
      }


      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');


      const passwordMatch = await bcrypt.compare(password, userRow.password);
      if (passwordMatch) {


        // const user_token=await this.db.fcm_notification.getFcmToken(userRow.id);
        // const fcmTokens = user_token ? user_token.token : '';

        const userRowDetails = await this.db.userDetails.findOne({
          where: {
            id: userRow.id
          },
        });

        const userData = {
          id: userRow.id,
          mlm_id: userRow.mlm_id,
          first_name: userRow.first_name,
          last_name: userRow.last_name,
          username: userRow.username,
          email: userRow.email,
          mobile: userRow.mobile,
          refered_by: userRow.refered_by,
          country: userRow.country,
          state: userRow.state,
          circle: userRow.circle,
          district: userRow.district,
          division: userRow.division,
          region: userRow.region,
          block: userRow.block,
          pincode: userRow.pincode,
          address: userRow.address,
          dob: userRow.dob,
          is_prime: userRowDetails.dataValues.is_prime,
          registration_date: userRowDetails.dataValues.registration_date,

        };





        const token = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });
        const refreshToken = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });

        if (userData) {


          const skey = config.SECRET_KEY;
          const data = {
            'user_id': userRow.id,
            'first_name': userRow.first_name,
            'last_name': userRow.last_name,
            'mobile': userRow.mobile,
            'email': userRow.email,
            'mlm_id': userRow.mlm_id,
            'password': userRow.password,
            'state': userRow.state,
            'country': userRow.country,
            'dob': userRow.dob,
            'address': userRow.address,
            'ref_mlm_id': userRowDetails.ref_mlm_id,
          };

          const { iv, encryptedData } = utility.generateAESToken(JSON.stringify(data), skey);

          /* const serializedData = await userUtility.userRegister(encryptedData, iv);
           if(serializedData.result)
           {
               userData.shopping_id = serializedData.result.response.id;
           }*/

        }


        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, token: token, refreshToken: refreshToken, message: 'Login successful', data: userData })));

      } else {
        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Invalid password', data: [] })));
      }


    }
    catch (err) {
      logger.error(`Unable to find user: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, token: '', message: err, data: [] })));

    }



  }

  async admin_login(req, res) {

    const { username, password, is_admin, captchaToken } = req;

    /* if (!captchaToken) {
         return res.status(400).json({ status: 400, message: 'CAPTCHA verification failed',  data: []});
       }
 */

    try {
      const whereClause = { 'username': username, 'is_admin': is_admin }
      const attributes = ['id', 'password', 'first_name', 'last_name', 'email', 'mobile'];

      /* const isCaptchaValid = await recaptchaUtility.captchaVerification(captchaToken)
         if (isCaptchaValid.success == false) {
           return res.status(400).json({ status: 400, message: 'CAPTCHA verification failed',  data: []});
         }
  */

      const userRow = await this.db.user.getData(attributes, whereClause);

      //console.log(userRow.dataValues.id);
      if (userRow == null) {
        return res.status(401).json({ status: 401, token: '', message: 'User not found', data: [] });
      }

      const passwordMatch = await bcrypt.compare(password, userRow.dataValues.password);
      if (passwordMatch) {
        const userData = {
          id: userRow.id,
          first_name: userRow.first_name,
          last_name: userRow.last_name,
          username: userRow.username,
          email: userRow.email,
          mobile: userRow.mobile,
          refered_by: userRow.refered_by,
          country: userRow.country,
          state: userRow.state,
          circle: userRow.circle,
          district: userRow.district,
          division: userRow.division,
          region: userRow.region,
          block: userRow.block,
          pincode: userRow.pincode,
          address: userRow.address,
          dob: userRow.dob
        };
        const token = jwt.sign(userData, 'secretkey', { expiresIn: '1h' });
        return res.status(200).json({ status: 200, token: token, message: 'Login successful', data: userData });
      } else {
        return res.status(401).json({ status: 401, token: '', message: 'Invalid password', data: [] });
      }






    }
    catch (err) {
      logger.error(`Unable to find user: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }



  }


  async referralDetails(req, res) {

    const { referral_id } = req;


    try {
      const userRow = await this.db.user.findOne({
        where: {
          referred_by: referral_id
        },
        //limit: 1, // Limit the result to one row
        logging: sql => console.log(sql) // Log the SQL query
      });
      if (!userRow) {
        return res.status(401).json({ status: 401, token: '', message: 'User not found', data: [] });
      }


    }
    catch (err) {
      logger.error(`Unable to find user: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }



  }


  async updateUserStatus(req, res) {
    const { id, action, status, reason } = req;

    const requiredKeys = Object.keys({ id, action, status });
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {

      const rejectionReason = (status == 0) ? reason : null;
      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      let action_details = '';
      let type = '';

      if (status == 0) {
        action_details = 'Block By Admin';
        type = 'admin_block';
      } else {
        action_details = 'Unblock By Admin';
        type = 'admin_unblock';
      }

      const dataLog = {
        user_id: id,
        created_on,
        created_by: 131507,
        action_details,
        logtype: type
      };

      const userLog = await this.db.userLog.insertData(dataLog);

      const data = {
        status,
        inactive_reason: rejectionReason,
        modified_on: created_on,
        modified_by: 2
      };


      const updatedUserStatus = await this.db.user.updateData(data, id);

      if (updatedUserStatus > 0) {
        return res.status(200).json({ status: 200, message: 'User Status Updated Successful.' });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }

  async updateUserStatus_old(req, res) {
    const { id, action, status } = req;


    const requiredKeys = Object.keys({ id, action, status });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {

      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const data = {
        id,
        status,
        modified_on: created_on
      };


      const updatedUserStatus = await this.db.user.updateData(data, id);

      if (updatedUserStatus > 0) {
        return res.status(200).json({ status: 200, message: 'User Status Updated Successful.' });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }


  async getProfile(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { id } = decryptedObject;

    const requiredKeys = Object.keys({ id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));

    }

    let t;

    try {

      const userRow = await this.db.userDetails.findOne({
        where: {
          id: id
        },

      });

      if (userRow) {

        const Result = [];
        let planArray = [];

        if (userRow.dataValues.plan_name) {
          const planString = userRow.dataValues.plan_name;
          planArray = planString.split(',');
        }

        const plansToCheck = ['Hybrid Prime', 'Booster Prime', 'Prime', 'Prime B'];

        const flagsObject = {};
        plansToCheck.forEach(plan => {
          flagsObject[plan.toLowerCase()] = planArray.includes(plan) ? 1 : 0;
        });

        Result.push({

          ...userRow.dataValues,
          flagsObject
        });

        const total_cashback = await this.db.cashback.getCashbackTotalAmount(id);
        const total_referral = await this.db.referral_idslevel.getReferralCount(id, 1);

        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User found Successful.', data: Result, total_cashback: total_cashback, total_referral: total_referral })));
        // return res.status(200).json({ status: 200, message: 'User found Successful.',  data: Result });
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));

      }

    } catch (error) {
      logger.error(`Unable to find User: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));

    }
  }


  async updateProfile(fileName, req, res) {

    const {
      user_id,
      country_id,
      state_id,
      city_id,
      pincode,
      postOfficeName,
      circle,
      district,
      division,
      region,
      block,
      dob,
      address,
      aniversary_date,
      gender } = req;

    let t;

    try {

      const filePath = fileName;
      const path = 'uploads/user/';

      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const userRow = await this.db.user.findOne({
        where: {
          id: user_id
        },

      });
      const profile_pic = filePath ? path + filePath : null;
      const data = {
        profile_pic: profile_pic,
        country_id,
        state_id,
        city_id,
        pincode,
        postOfficeName,
        circle,
        district,
        division,
        region,
        block,
        dob: dob ? dob : null,
        address,
        aniversary_date,
        modified_on: created_on,
        gender
      };

      const updatedUser = await this.db.user.updateData(data, userRow.id);

      if (updatedUser > 0) {
        return res.status(200).json({ status: 200, message: 'User update Successful.', data: data });
        //  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User update Successful.', data:data})));
      } else {

        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
        // return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });

      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        //   return res.status(500).json({ status: 500,errors: validationErrors });
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));
      // return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }



  async updateProfileUserInfo(req, res) {

    const decryptedObject = utility.DataDecrypt(req.encReq);

    const {
      user_id,
      education,
      profession,
      product_selling_exprience,
      experience_fields,
      previous_monthly_earning,
      expected_monthly_earning,
      having_two_wheeler,
      vehicle_no,
      vehicle_budget,
      having_car,
      car_vehicle_no,
      car_purchase_budget,
      own_house,
      house_budget,
      married,
      child,
      insurance,
      sip_mutual_fund,
      amount_investment,
      target_wealth

    } = decryptedObject;

    const requiredKeys = Object.keys({ user_id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));

    }


    let t;

    try {
      let updatedUser = '';


      const userRow = await this.db.userProfileDetails.findOne({
        where: {
          user_id: user_id
        }
      });

      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');



      if (userRow) {
        const data = {

          education,
          profession,
          product_selling_exprience,
          experience_fields,
          previous_monthly_earning,
          expected_monthly_earning,
          having_two_wheeler,
          vehicle_no,
          vehicle_budget,
          having_car,
          car_vehicle_no,
          car_purchase_budget,
          own_house,
          house_budget,
          married,
          child,
          insurance,
          sip_mutual_fund,
          amount_investment,
          target_wealth,
          modified_on: created_on,
          modified_by: user_id

        };
        updatedUser = await this.db.userProfileDetails.updateData(data, { user_id: userRow.user_id });

      } else {
        const data = {
          user_id,
          education,
          profession,
          product_selling_exprience,
          experience_fields,
          previous_monthly_earning,
          expected_monthly_earning,
          having_two_wheeler,
          vehicle_no,
          vehicle_budget,
          having_car,
          car_vehicle_no,
          car_purchase_budget,
          own_house,
          house_budget,
          married,
          child,
          insurance,
          sip_mutual_fund,
          amount_investment,
          target_wealth,
          created_by: user_id

        };
        updatedUser = await this.db.userProfileDetails.insertData(data);
      }

      if (updatedUser) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User update Successful.' })));
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));

      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));


    }
  }


  async getProfileUserDetails(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id } = decryptedObject;

    const requiredKeys = Object.keys({ user_id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {

      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));

    }



    try {

      const userRow = await this.db.userProfileDetails.findOne({
        where: {
          user_id: user_id
        },

      });

      if (userRow) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User found Successful.', data: userRow })));
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));

      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));

    }
  }



  async updateUserDetails(req, res) {
    const { user_id, sender_user_id, firstName, lastName, mobile, email, password, is_portfolio } = req;

    const requiredKeys = Object.keys({ user_id, sender_user_id, firstName, lastName, mobile, email, is_portfolio });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {


      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const userRow = await this.db.user.findOne({
        where: {
          id: user_id
        },

      });

      if (userRow) {

        const data = {

          first_name: firstName,
          last_name: lastName,
          mobile: mobile,
          username: mobile,
          email: email,
          modified_by: sender_user_id,
          modified_on: created_on,
          is_portfolio: is_portfolio
        };

        if (password != null || password != '') {
          data.password = bcrypt.hashSync(password, 10);
        }

        const updatedUserStatus = await this.db.user.updateData(data, userRow.id);

        if (updatedUserStatus > 0) {
          return res.status(200).json({ status: 200, message: 'User Info Updated Successful.' });
        } else {
          return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
        }


      }


    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }



  async checkMobileOrEmail(req, res) {
    const { mobileOrEmail } = req;

    const requiredKeys = Object.keys({ mobileOrEmail });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {


      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      const getUserSearchByData = { mobile: mobileOrEmail, email: mobileOrEmail }
      const userRow = await this.db.user.getUserSearchByData(getUserSearchByData);

      if (userRow) {
        return res.status(200).json({ status: 200, message: 'User found Successful.', data: userRow });
      } else {
        return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }





    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }

      return res.status(500).json({ status: 500, message: error, data: [] });
    }
  }





  async loginTest(req, res) {
    //  const decryptedObject = utility.DataDecrypt(req.encReq);
    const { username, password } = req;


    try {

      const getUserSearchByData = { username, mobile: username, mlm_id: username, email: username }
      const userRow = await this.db.user.getUserSearchByDataWithOR(getUserSearchByData);

      if (!userRow) {
        return res.status(401).json({ status: 401, token: '', message: 'User not found', data: [] });
      }


      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');


      const passwordMatch = await bcrypt.compare(password, userRow.password);
      if (passwordMatch) {

        const user_token = await this.db.fcm_notification.getFcmToken(userRow.id);
        const fcmTokens = user_token ? user_token.token : '';

        const userData = {
          id: userRow.id,
          mlm_id: userRow.mlm_id,
          first_name: userRow.first_name,
          last_name: userRow.last_name,
          username: userRow.username,
          email: userRow.email,
          mobile: userRow.mobile,
          refered_by: userRow.refered_by,
          country: userRow.country,
          state: userRow.state,
          circle: userRow.circle,
          district: userRow.district,
          division: userRow.division,
          region: userRow.region,
          block: userRow.block,
          pincode: userRow.pincode,
          address: userRow.address,
          dob: userRow.dob,
          registration_date: userRow.created_on,
        };
        const token = jwt.sign(userData, 'secretkey', { expiresIn: '7d' });



        if (fcmTokens.length > 0) {

          const notification = await notificationUtility.loginNotification(fcmTokens, userRow.first_name, userRow.last_name, userRow.id);
          await this.db.log_app_notification.insertData(notification);

        }

        return res.status(200).json({ status: 200, token: token, message: 'Login successful', data: userData });

      } else {
        return res.status(401).json({ status: 401, token: '', message: 'Invalid password', data: [] });
      }


    }
    catch (err) {
      logger.error(`Unable to find user: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      return res.status(500).json({ status: 500, token: '', message: err, data: [] });
    }



  }


  async unblockByUser(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { mobile_no } = decryptedObject;
    const requiredKeys = Object.keys({ mobile_no });
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    try {
      const userRow = await this.db.user.findOne({
        where: {
          mobile: mobile_no
        },
      });

      if (userRow) {

        const userRowLog = await this.db.userLog.findOne({
          where: {
            user_id: userRow.id,

          },
          order: [['id', 'DESC']],
        });

        if (userRowLog.logtype !== 'admin_block') {

          const currentDate = new Date();
          const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

          const dataLog = {
            user_id: userRow.id,
            created_on,
            created_by: userRow.id,
            action_details: 'Unblock By User',
            logtype: 'user_unblock'
          };
          const userLog = await this.db.userLog.insertData(dataLog);

          const data = {
            status: 1,
            modified_on: created_on,
            modified_by: userRow.id
          };
          const updatedUserStatus = await this.db.user.updateData(data, userRow.id);

          if (updatedUserStatus) {
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User Unblock' })));
            // return res.status(200).json({ status: 200, message: 'User Unblock'});
          } else {
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
            // return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
          }
        } else {
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Dear user, your Mirror Id is temporarily blocked by administrator! Please contact the Support Team at 9112421742', data: [] })));
          //  return res.status(500).json({ status: 500, message: 'Your Id is blocked by Admin', data: [] });
        }
      }

    } catch (error) {
      logger.error(`Unable to find User: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: validationErrors })));
        //   return res.status(500).json({ status: 500,errors: validationErrors });
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));
      // return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
  }



  async unblockByUserTest(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { mobile_no } = decryptedObject;
    const requiredKeys = Object.keys({ mobile_no });
    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      // return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    let t;

    //   try {
    const userRow = await this.db.user.findOne({
      where: {
        mobile: mobile_no
      },
    });



    if (userRow) {

      const userRowLog = await this.db.userLog.findOne({
        where: {
          user_id: userRow.id,

        },
        order: [['id', 'DESC']],
      });

      if (userRowLog.type !== 'admin_block') {

        const currentDate = new Date();
        const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

        const dataLog = {
          user_id: userRow.id,
          created_on,
          created_by: userRow.id,
          action_details: 'Unblock By User'
        };
        const userLog = await this.db.userLog.insertData(dataLog);

        const data = {
          status: 1,
          modified_on: created_on,
          modified_by: userRow.id
        };
        const updatedUserStatus = await this.db.user.updateData(data, userRow.id);

        if (updatedUserStatus) {
          //   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User Unblock'})));
          return res.status(200).json({ status: 200, message: 'User Unblock' });
        } else {
          //   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
          return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
        }
      } else {
        //  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Your Id is blocked by Admin', data: [] })));
        return res.status(500).json({ status: 500, message: 'Your Id is blocked by Admin', data: [] });
      }
    }

    // } catch (error) {
    //     logger.error(`Unable to find User: ${error}`);
    //     if (error.name === 'SequelizeValidationError') {
    //       const validationErrors = error.errors.map((err) => err.message);
    //         return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    //     //   return res.status(500).json({ status: 500,errors: validationErrors });
    //     }
    //     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error ,data:[]})));
    //     // return res.status(500).json({ status: 500,  message: error ,data:[]});
    // }
  }


  async deactiveUser(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id, status, reason } = decryptedObject;

    const requiredKeys = Object.keys({ user_id, status });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
      //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    let t;

    try {

      const rejectionReason = (status == 0) ? reason : null;
      const currentDate = new Date();
      const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

      let action_details = '';
      let type = '';



      // if(status==0){
      action_details = 'Block By Self';
      type = 'user_block';
      // }else{
      //   action_details='Unblock By Admin';
      //   type='admin_unblock';
      // }

      const dataLog = {
        user_id: user_id,
        created_on,
        created_by: user_id,
        action_details,
        logtype: type
      };

      const userLog = await this.db.userLog.insertData(dataLog);

      const data = {
        status,
        inactive_reason: rejectionReason,
        modified_on: created_on,
        modified_by: user_id
      };


      const updatedUserStatus = await this.db.user.updateData(data, user_id);

      if (updatedUserStatus) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'User Status Updated Successful.' })));
        //   return res.status(200).json({ status: 200, message: 'User Status Updated Successful.'});
      } else {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Failed to Update data', data: [] })));
        //   return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
      }

    } catch (error) {
      logger.error(`Unable to find Kyc: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        //  return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
        return res.status(500).json({ status: 500, errors: validationErrors });
      }
      // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));
      return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
  }




  async loginTes(req, res) {
    // const decryptedObject = utility.DataDecrypt(req.encReq);
    const { username, password } = req;


    try {

      const getUserSearchByData = { mobile: username }
      const userRow = await this.db.user.getUserSearchByDataWithORStatus(getUserSearchByData);

      if (!userRow) {
        return res.status(401).json(

          JSON.stringify({ status: 401, token: '', message: 'User not found', data: [] })

        );
      }


      // if(userRow.status == 0)
      // {
      //     return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401,token:'',message: 'You are temporarily blocked. Please contact the Support Team at 9112421742.',data: [] })));
      // }


      // const currentDate = new Date();
      // const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');


      //const passwordMatch = await bcrypt.compare(password, userRow.password);
      if (true) {

        // const user_token=await this.db.fcm_notification.getFcmToken(userRow.id);
        // const fcmTokens = user_token ? user_token.token : '';

        const userRowDetails = await this.db.userDetails.findOne({
          where: {
            id: userRow.id
          },
        });

        const userData = {
          id: userRow.id,
          mlm_id: userRow.mlm_id,
          first_name: userRow.first_name,
          last_name: userRow.last_name,
          username: userRow.username,
          email: userRow.email,
          mobile: userRow.mobile,
          refered_by: userRow.refered_by,
          country: userRow.country,
          state: userRow.state,
          circle: userRow.circle,
          district: userRow.district,
          division: userRow.division,
          region: userRow.region,
          block: userRow.block,
          pincode: userRow.pincode,
          address: userRow.address,
          dob: userRow.dob,
          is_prime: userRowDetails.dataValues.is_prime,
          registration_date: userRowDetails.dataValues.registration_date,

        };
        const token = jwt.sign(userData, 'secretkey', { expiresIn: '7d' });

        return res.status(200).json(
          { status: 200, token: token, message: 'Login successful', data: userData }

        );

      } else {
        return res.status(401).json(

          JSON.stringify({ status: 401, token: '', message: 'Invalid password', data: [] })

        );
      }


    }
    catch (err) {
      logger.error(`Unable to find user: ${err}`);
      if (err.name === 'SequelizeValidationError') {
        const validationErrors = err.errors.map((err) => err.message);
        return res.status(500).json(
          JSON.stringify({ status: 500, errors: validationErrors })

        );
      }
      return res.status(500).json(
        JSON.stringify({ status: 500, token: '', message: err, data: [] })
      );
    }



  }




}




module.exports = new Login();