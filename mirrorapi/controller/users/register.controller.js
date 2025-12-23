const { connect, config } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const utility = require('../../utility/utility');
const { secretKey } = require('../../middleware/config');
const { QueryTypes, Sequelize, Model, DataTypes, Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const helper = require('../utility/helper'); 
const userUtility = require('../../utility/user.utility');
const whatsappUtility = require('../../utility/whatsapp.utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const messagingService = require('../../router/whatsapp/messagingService');
const SlabService = require('../../cron/slab/slab_service')
const emailUtility = require('../../utility/email.utility');
class Register {

  db = {};

  constructor() {
    this.db = connect();

  }

  async refferedBy(req, res, ipAddress) {

    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { mlm_id } = decryptedObject;

    const requiredKeys = Object.keys({ mlm_id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)

    ) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }


    try {

      const getUserSearchByData = { mlm_id: mlm_id, mobile: mlm_id }
      const results = await this.db.user.getUserSearchByData(getUserSearchByData);
      let userData = [];

      if (results) {
        userData = {
          'id': results.id,
          'name': results.first_name + ' ' + results.last_name,
          'mlm_id': results.mlm_id,
          'mobile': results.mobile
        }
      }

      if (results !== null) {
        try {
          const message = await whatsappUtility.registerWhatsappMessage(results.first_name, results.last_name, results.mobile);
          const emailMsg = await emailUtility.registerEmailMessage(results.first_name, results.last_name, results.mobile);
          messagingService.sendMessage(mobile, message, null, results.email, "Welcome to Mayway", emailMsg);
        } catch (error) {
          console.log('Error in whatsapp message', error);
        }

        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Exist', data: userData, ipAddress })));
      }

      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Reffer Not Exist', data: [] })));



    } catch (error) {
      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        //const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Error', data: 'Internal Server Error' })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
    }
    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));
  }


  async getUserDetails(req, res) {

    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { mobile_no } = decryptedObject;

    const requiredKeys = Object.keys({ mobile_no });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)

    ) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }


    try {

      const getUserSearchByData = { mlm_id: mobile_no, mobile: mobile_no }
      const results = await this.db.user.getUserSearchByData(getUserSearchByData);

      if (results && results.referred_by > 0) {

        const getReferralUser = await this.db.user.getData(['first_name', 'last_name', 'mlm_id', 'mobile'], { id: results.referred_by, status: [0, 1] });

        results.dataValues.ref_first_name = getReferralUser.first_name;
        results.dataValues.ref_last_name = getReferralUser.last_name;
        results.dataValues.ref_mobile = getReferralUser.mobile;
        results.dataValues.ref_mlm_id = getReferralUser.mlm_id;
      }

      if (results !== null) {
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Exist', data: results })));
      }
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'User Not Exist', data: [] })));


    } catch (error) {
      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Error', data: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error, data: [] })));
    }
    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));
  }

  async register(req, res, ipAddress) {
    const decryptedObject = utility.DataDecrypt(req.encReq);

    let results = {};
    const {
      referred_by,
      first_name,
      last_name,
      username,
      email,
      mobile,
      password,
      //country_id,
      //state_id,
      //city_id,
      pincode,
      postOfficeName,
      circle,
      district,
      division,
      region,
      block,
      dob,
      address,
      aniversary_date
    } = decryptedObject;

    const requiredKeys = Object.keys({
      referred_by,
      first_name,
      last_name,
      username,
      email,
      mobile,
      password,
      //country_id,
      //state_id,
      //city_id,
      pincode,
      postOfficeName,
      circle,
      district,
      division,
      region,
      dob
    });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)

    ) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
    }

    const whereChk = { id: referred_by };
    const UserAttribute = ['id', 'first_name', 'last_name', 'mobile'];
    const userRowRefferal = await this.db.user.getData(UserAttribute, whereChk);

    // if (!userRowRefferal) {
    //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, message: 'Refferal ID Not found', data: [] })));
    // }



    // const PrimeCheck = await this.db.PlanPurchase.getPrimeCount(userRowRefferal.id);


    // if (!PrimeCheck) {

    //   return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, message: 'Refferal ID is not Prime', data: [] })));

    // }

    let t = await this.db.sequelize.transaction();
    const projectId = 1;
    try {

      const getUserSearchByData = { mobile, email };

      if (await this.db.user.emailOrMobileExists({ mobile }) > 0) {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Sorry ! User Mobile No. is Already Exists. Please use another mobile no.' })));
        // return res.status(500).json({ status: 500,error: 'Sorry ! User Mobile No. is Already Exists. Please use another mobile no.' });
      }

      if (await this.db.user.emailOrMobileExists({ email }) > 0) {
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Sorry ! User Email Id is Already Exists. Please use another Mail Id.' })));
        // return res.status(500).json({ status: 500,error: 'Sorry ! User Email Id is Already Exists. Please use another Mail Id.' });
      }

      //   if(await this.db.user.emailOrMobileExists(getUserSearchByData)==0)
      //   {
      let mrNo = utility.generateUniqueNumericAddMoney(6);
      let mlm_id = `MR${mrNo}`;
      if (await this.db.user.checkMlm(mlm_id) > 0) {
        mrNo = utility.generateUniqueNumericAddMoney(6);
        mlm_id = `MR${mrNo}`;
      }


      const userData = {
        mlm_id,
        referred_by,
        first_name,
        last_name,
        username,
        email,
        mobile,
        password: bcrypt.hashSync(password, 10),
        //country_id,
        //state_id,
        //city_id,
        pincode,
        postOfficeName,
        circle,
        district,
        division,
        region,
        dob,
        aniversary_date,
        email_verified: 1,
        mobile_verified: 1
      }

      const results = await this.db.user.insertData(userData, { transaction: t });

      if (results) {
        userData.id = results.id;
        const token = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });
        const refreshToken = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });
        await SlabService.addUserToFirstSlab(userData.id)
        const emaiMsg = await emailUtility.registerEmailMessage(first_name, last_name, mobile);
        messagingService.sendMessage(mobile, await whatsappUtility.registerWhatsappMessage(first_name, last_name, mobile), null, email, "Welcome to Mirror", emaiMsg);
        return res.status(200).json({ status: 200, token: token, refreshToken: refreshToken, message: 'Registration successful', data: results });
      } else {
        await t.rollback();
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, error: 'Failed to create' })));
      }


      //   }else{
      //     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Already Exist' })));
      //   }

    } catch (error) {
      await t.rollback();

      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data: validationErrors })));
      }
      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, error: error.message, data: [] })));
    }
    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));

  }



  async investment(req, res, ipAddress) {

    //const decryptedObject = utility.DataDecrypt(req.encReq);



    let results = {};
    const {
      user_id,
      inv_type,
      percentage
    } = req;

    return res.status(200).json({ status: 200, message: 'Added Successfully', data: [] });
  }




  async cashback_wallet(user_id, credit, ipAddress) {
    const currentDate = new Date();
    const created_on = currentDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');
    const order_id = utility.generateUniqueNumeric(7);

    const orderData = {
      user_id,
      env: config.env,
      tran_type: 'Credit',
      tran_sub_type: 'Register',
      tran_for: 'cashback',
      trans_amount: credit,
      currency: 'INR',
      order_id,
      order_status: 'PENDING',
      created_on,
      created_by: user_id,
      ip_address: ipAddress
    };

    const generateorder = await this.db.upi_order.insertData(orderData);

    if (generateorder && generateorder.id) {

      const cashbackData = {
        user_id,
        env: config.env,
        type: 'Credit',
        sub_type: 'Register',
        tran_for: 'cashback',
        amount: credit,
        transaction_id: generateorder.order_id

      };
      return await this.db.cashback.insert_cashback_wallet(cashbackData);

    }


    return null;

  }

  async prime_wallet(user_id, credit, ipAddress) {

    const primeData = {
      user_id,
      env: config.env,
      type: 'Credit',
      sub_type: 'Register',
      tran_for: 'prime',
      amount: credit
    };

    return await this.db.prime.insert_prime_wallet(primeData);
  }


  async shopingPortalLogin(req, res) {
    const decryptedObject = utility.DataDecrypt(req.encReq);
    const { user_id } = decryptedObject;

    const requiredKeys = Object.keys({ user_id });

    if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)

    ) {
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }


    try {
      const skey = config.SECRET_KEY;
      const whereChk = { id: user_id };
      const UserAttribute = ['id', 'first_name', 'last_name', 'mobile', 'mlm_id', 'password', 'state', 'country', 'dob', 'address', 'ref_mlm_id', 'email'];
      const userRow = await this.db.userDetails.getData(UserAttribute, whereChk);

      if (userRow !== null) {

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
          'ref_mlm_id': userRow.ref_mlm_id,
        };

        const { iv, encryptedData } = utility.generateAESToken(JSON.stringify(data), skey);

        const serializedData = await userUtility.userRegister(encryptedData, iv);
        //const serializedData = flatted.stringify(result);


        //return res.status(200).json({ status: 200,message:'Exist',data: serializedData.result });
        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Exist', data: serializedData.result })));
      }

      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'User Not Exist', data: [] })));
      //return res.status(400).json({ status: 400, message:'User Not Exist',data:[] });



    } catch (error) {
      logger.error(`Unable to find user: ${error}`);
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: 'Error', data: 'Internal Server Error' })));
        //return res.status(500).json({ status: 500, message:'Error',data: validationErrors });
      }

      return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
      //return res.status(500).json({ status: 500,  message: error ,data:[]});
    }
    return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Bad request', data: [] })));
    return res.status(400).json({ status: 400, message: 'Bad request', data: [] });
  }



  async registerTest(req, res, ipAddress) {



    let results = {};
    const {
      referred_by,
      first_name,
      last_name,
      username,
      email,
      mobile,
      password,
      //country_id,
      //state_id,
      //city_id,
      pincode,
      postOfficeName,
      circle,
      district,
      division,
      region,
      block,
      dob,
      address,
      aniversary_date
    } = req;

    const requiredKeys = Object.keys({
      referred_by,
      first_name,
      last_name,
      username,
      email,
      mobile,
      password,
      //country_id,
      //state_id,
      //city_id,
      pincode,
      postOfficeName,
      circle,
      district,
      division,
      region,
      dob
    });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)

    ) {
      return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }

    const whereChk = { id: referred_by };
    const UserAttribute = ['id', 'first_name', 'last_name', 'mobile'];
    const userRowRefferal = await this.db.user.getData(UserAttribute, whereChk);

    if (!userRowRefferal) {
      return res.status(401).json({ status: 401, message: 'Refferal ID Not found', data: [] });
    }

    let t = await this.db.sequelize.transaction();
    const projectId = 1;
    try {

      const getUserSearchByData = { mobile, email };

      if (await this.db.user.emailOrMobileExists({ mobile }) > 0) {
        // return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Sorry ! User Mobile No. is Already Exists. Please use another mobile no.' })));
        return res.status(500).json({ status: 500, error: 'Sorry ! User Mobile No. is Already Exists. Please use another mobile no.' });
      }

      if (await this.db.user.emailOrMobileExists({ email }) > 0) {
        //   return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Sorry ! User Email Id is Already Exists. Please use another Mail Id.' })));
        return res.status(500).json({ status: 500, error: 'Sorry ! User Email Id is Already Exists. Please use another Mail Id.' });
      }

      //   if(await this.db.user.emailOrMobileExists(getUserSearchByData)==0)
      //   {
      let mrNo = utility.generateUniqueNumericAddMoney(6);
      let mlm_id = `MR${mrNo}`;
      if (await this.db.user.checkMlm(mlm_id) > 0) {
        mrNo = utility.generateUniqueNumericAddMoney(6);
        mlm_id = `MR${mrNo}`;
      }


      const userData = {
        mlm_id,
        referred_by,
        first_name,
        last_name,
        username,
        email,
        mobile,
        password: bcrypt.hashSync(password, 10),
        //country_id,
        //state_id,
        //city_id,
        pincode,
        postOfficeName,
        circle,
        district,
        division,
        region,
        dob,
        aniversary_date,
        email_verified: 1,
        mobile_verified: 1
      }

      const results = await this.db.user.insertData(userData, { transaction: t });

      if (results) {
        const cashbackAmount = '50.00';
        let primeAmount = '10.00';
        let cashbackUser = results.id;

        const cashbackPromise = this.cashback_wallet(cashbackUser, cashbackAmount, ipAddress);
        const primePromise = this.prime_wallet(cashbackUser, primeAmount, ipAddress);
        await Promise.all([cashbackPromise, primePromise]);

        if (referred_by > 0) {

          //primeAmount = '5.00';

          const cashbackReffer = this.cashback_wallet(referred_by, cashbackAmount, ipAddress);
          // const primeReffer =  this.prime_wallet(referred_by, primeAmount,ipAddress);
          await Promise.all([cashbackReffer]);
        }

        userData.id = results.id;
        const token = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });
        const refreshToken = jwt.sign(userData, 'secretkey', { expiresIn: '30d' });

        await t.commit();
        return res.status(200).json({ status: 200, token: token, refreshToken: refreshToken, message: 'Registration successful', data: results });
        //   return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,  token: token, refreshToken:refreshToken, message: 'Registration successful' ,data:results})));
      } else {
        await t.rollback();
        return res.status(500).json({ status: 500, error: 'Failed to create' });
      }


      //   }else{
      //     return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'Already Exist' })));
      //   }

    } catch (error) {
      await t.rollback();

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map((err) => err.message);
        return res.status(500).json({ status: 500, errors: 'Internal Server Error', data: validationErrors });
      }
      return res.status(500).json({ status: 500, message: error.message, error: error.message, data: [] });
    }
    return res.status(400).json({ status: 400, message: 'Bad request', data: [] });

  }

}

module.exports = new Register();