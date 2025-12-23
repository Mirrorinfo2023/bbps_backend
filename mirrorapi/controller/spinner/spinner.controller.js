const { connect,config } = require('../../config/db.config');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize,sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const rechargeUtility = require('../../utility/recharge.utility'); 
const jwt = require('jsonwebtoken');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const whatsappUtility = require('../../utility/whatsapp.utility');


class Spinner {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    
    async getWalletBalance(user_id)
    {
        const [walletBalance, cashbackBalance, primeBalance, affiliateBalance, voucher ] = await Promise.all([
            this.db.wallet.getWalletAmount(user_id),
            this.db.cashback.getCashbackAmount(user_id),
            this.db.prime.getPrimeAmount(user_id),
            this.db.affiliate.getAffiliateAmount(user_id),
            this.db.coupon.getCouponCount(user_id)
          ]);

          

          return {walletBalance: walletBalance, cashbackBalance:cashbackBalance, primeBalance: primeBalance, voucher:voucher}
    }

    async getCashback(req,res, ipAddress) {  
     const decryptedObject = utility.DataDecrypt(req.encReq);
    
        const {user_id} = decryptedObject;

        const requiredKeys = Object.keys({ user_id });
            
      if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
        //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
      }

      
      let t = await this.db.sequelize.transaction();
            
      try {
        let responseData = {};
        let wallet_amount = [];
        const getLastSipnner = await this.db.spinner.findOne({
                where:{
                    'user_id':user_id,
                    'status':1,
                    'expire_date': {
                        [Sequelize.Op.gte]: new Date()
                    }
                },
                order: [['id', 'DESC']]
            });
        const attempt = getLastSipnner.attempt;
           
        if(getLastSipnner && parseInt(attempt)<4)
        {
           
            const getData = await this.db.spinner.findOne({
                where:{
                    'user_id':user_id,
                    'status':1,
                    'attempt':attempt,
                    'expire_date': {
                        [Sequelize.Op.gte]: new Date()
                    }
                },
                order: [['id', 'DESC']]
            });

            if(getData!=null)
            {
                //const rechargeData = await this.checkLatest(user_id);
            
                let cashbackAmount = 0;
                let cashbackType = '';
                let isWBalance = 0;
                

                if(getData.redeem_amount == 0){isWBalance = 1;}

                const outcomes = ['Wallet Balance of Cashback/Prime', 'Ebook Coupon discount flat 10%', 'Shopping Discount Coupon flat 2%', 'Better luck next time'];
                const messages = ['Prime Points', 'Ebook Voucher', 'Shopping Voucher', 'Better luck next time'];

                const randomIndex = Math.floor(Math.random() * outcomes.length);

                if(await this.db.userSpin.getData(user_id, getData.spinner_id, outcomes[randomIndex]))
                {
                    let spinData = {
                        user_id:user_id, 
                        spin_date: Date.now(), 
                        spinner_id: getData.spinner_id, 
                        spin_outcome: 'Better luck next time', 
                        attempt: attempt+1, 
                        main_amount:getData.main_amount,
                        cashback_amount: cashbackAmount,
                        cashback_type: cashbackType
                    }

                    await this.db.userSpin.insert(spinData, { transaction: t });

                    await this.db.spinner.update(
                        {attempt: attempt+1, is_used:0, used_date: Date.now()},
                        { where: { id: getData.id } }
                    );

                    if(attempt==4)
                    {
                        await this.db.spinner.update(
                            {attempt: attempt, is_used:1, used_date:Date.now()},
                            { where: { id:getData.id } }
                        );
                    }
                    
                    responseData = {'cashback_amount': cashbackAmount, 'cashback_type': cashbackType, 'details': 'Better luck next time', 'attempts': attempt+1}
                    wallet_amount = await this.getWalletBalance(user_id);
                    //return res.status(200).json({ status: 200, message: 'Better luck next time', data: responseData });
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Better luck next time', data: responseData, wallet_amount:wallet_amount })));
                }
                
                if(randomIndex!=3)
                {

                    let amount = getData.main_amount;
                    //return getData;

                    const order_id=utility.generateUniqueNumeric(7);
                    let transaction_id = order_id;
                    // Order Generate
                    const orderData = {
                        user_id:user_id,
                        env:config.env, 
                        tran_type:'Credit',
                        tran_sub_type:'Spin',
                        tran_for:'Spin Cashback',
                        trans_amount:amount,
                        currency:'INR',
                        order_id,
                        order_status:'SUCCESS',
                        created_on:Date.now(),
                        created_by:user_id,
                        ip_address:ipAddress
                    };
                    
                    const generateorder = await this.db.upi_order.insertData(orderData); 

                    if(randomIndex == 0 && isWBalance==0)
                    {
                        cashbackAmount = getData.redeem_amount;
                        cashbackType = 'Main Wallet';
                        
                        let walletData = {
                            transaction_id:transaction_id,
                            user_id:user_id,
                            env:config.env,
                            type:'Credit',
                            amount:getData.redeem_amount,
                            sub_type:'Spin Cashback',
                            tran_for:'main'
                        };
                        
                        await this.db.wallet.insert_wallet(walletData);
                    }else if(randomIndex == 0 && isWBalance==1){
                        if(amount>=200)
                        {
                            cashbackAmount = 1;
                            cashbackType = 'Prime Wallet';
                            let primeData = {
                                user_id:user_id, 
                                env: config.env, 
                                type: 'Credit', 
                                sub_type: 'Spin Cashback', 
                                tran_for: 'prime', 
                                amount:1,
                                transaction_id:transaction_id
                            };
                            
                            await this.db.prime.insert_prime_wallet(primeData, { transaction: t });
                        }

                        if(amount<200)
                        {
                            cashbackAmount = 1;
                            cashbackType = 'Cashback Wallet';
                            let cashbackData = {
                                user_id:user_id, 
                                env: config.env, 
                                type: 'Credit', 
                                sub_type: 'Spin Cashback', 
                                tran_for: 'cashback', 
                                amount:1,
                                transaction_id:transaction_id
                            };
                            
                            await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
                        }
                    }
                    // else if(randomIndex == 0 && isWBalance==0){
                    //     responseData = {'cashback_amount': cashbackAmount, 'cashback_type': cashbackType, 'details': 'Better luck next time', 'attempts': attempt+1}
                    //     return res.status(200).json({ status: 200, message: 'Better luck next time', data: responseData });
                    // }

                    // if(randomIndex == 1){
                    //     cashbackAmount = 5;
                    //     cashbackType = 'Cashback Wallet';

                    //     let cashbackData = {
                    //         user_id:user_id, 
                    //         env: config.env, 
                    //         type: 'Credit', 
                    //         sub_type: 'Spin Cashback', 
                    //         tran_for: 'cashback', 
                    //         amount:5,
                    //         transaction_id:transaction_id
                        
                    //     };
                    //     await this.db.cashback.insert_cashback_wallet(cashbackData, { transaction: t });
                    // }

                    if(randomIndex == 1){
                        cashbackAmount = parseFloat(amount*10/100);
                        cashbackType = 'Ebook Coupon';
                        let coupon_type = 'EBOOK';
                        let currentTimestampInSeconds = Math.floor(Date.now() / 1000);
                        let coupon_code = coupon_type.toUpperCase() +currentTimestampInSeconds;

                        let coupon_send_date = utility.formatDateTime(new Date());
                        let coupon_expire_date = utility.formatDateTime(new Date(new Date(coupon_send_date).getTime() + 60 * 60 * 24 * 1000));
                        let remaining_days = 1;

                        let couponData = {
                            user_id,
                            coupon_code,
                            coupon_type,
                            coupon_send_date,
                            coupon_expire_date,
                            remaining_days,
                            coupon_used:0,
                            isScratch:0,
                            applied_for:outcomes[randomIndex],
                            order_id:transaction_id,
                            redeem_amount:cashbackAmount
                        }
                        
                        await this.db.coupon.insert(couponData, { transaction: t });
                    }

                    if(randomIndex == 2){
                        cashbackAmount = parseFloat(amount*2/100);
                        cashbackType = 'Shoping Coupon';
                        let coupon_type = 'Shoping';
                        let currentTimestampInSeconds = Math.floor(Date.now() / 1000);
                        let coupon_code = coupon_type.toUpperCase() +currentTimestampInSeconds;

                        let coupon_send_date = utility.formatDateTime(new Date());
                        let coupon_expire_date = utility.formatDateTime(new Date(new Date(coupon_send_date).getTime() + 60 * 60 * 24 * 1000));
                        let remaining_days = 1;

                        let couponData = {
                            user_id,
                            coupon_code,
                            coupon_type,
                            coupon_send_date,
                            coupon_expire_date,
                            remaining_days,
                            coupon_used:0,
                            isScratch:0,
                            applied_for:outcomes[randomIndex],
                            order_id:transaction_id,
                            redeem_amount:cashbackAmount
                        }
                        
                        await this.db.coupon.insert(couponData, { transaction: t });
                    }

                    let spinData = {
                        user_id:user_id, 
                        spin_date: Date.now(), 
                        spinner_id: getData.spinner_id, 
                        spin_outcome: outcomes[randomIndex], 
                        attempt: attempt+1, 
                        main_amount:getData.main_amount,
                        cashback_amount: cashbackAmount,
                        cashback_type: cashbackType
                    }

                    await this.db.userSpin.insert(spinData, { transaction: t });

                    await this.db.spinner.update(
                        {attempt: attempt+1, is_used:0, used_date:Date.now()},
                        { where: { id:getData.id } }
                    );

                    if(attempt==4)
                    {
                        await this.db.spinner.update(
                            {attempt: attempt, is_used:1, used_date:Date.now()},
                            { where: { id:getData.id } }
                        );
                    }

                    responseData = {'cashback_amount': cashbackAmount, 'cashback_type': cashbackType, 'details': outcomes[randomIndex], 'attempts': attempt+1}
                    //wallet_amount = await this.getWalletBalance(user_id);
                    await t.commit();
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Congratulations ! You Won Rs' + cashback_amount +' '+ messages[randomIndex], data: responseData })));
                    //return res.status(200).json({ status: 200, message: 'congratulations ! You have got ' + outcomes[randomIndex], data: responseData });

                }else{
                    let spinData = {
                        user_id:user_id, 
                        spin_date: Date.now(), 
                        spinner_id: getData.spinner_id, 
                        spin_outcome: outcomes[randomIndex], 
                        attempt: attempt+1, 
                        main_amount:getData.main_amount,
                        cashback_amount: cashbackAmount,
                        cashback_type: null
                    }

                    await this.db.spinner.update(
                        {attempt: attempt+1, is_used:0, used_date:Date.now()},
                        { where: { id:getData.id } }
                    );

                    if(attempt==4)
                    {
                        await this.db.spinner.update(
                            {attempt: attempt, is_used:1, used_date:Date.now()},
                            { where: { id:getData.id } }
                        );
                    }
                    
                    await this.db.userSpin.insert(spinData, { transaction: t });
                    
                    await t.commit();
                    
                    responseData = {'cashback_amount': cashbackAmount, 'cashback_type': 'NA', 'details': outcomes[randomIndex], 'attempts': attempt+1}
                    wallet_amount = await this.getWalletBalance(user_id);
                    return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: messages[randomIndex], data: responseData, wallet_amount:wallet_amount })));
                    //return res.status(200).json({ status: 200, message: outcomes[randomIndex], data: responseData });
                }

            }else{
                responseData = {'cashback_amount': 0, 'cashback_type': 'NA', 'details': '', 'attempts': attempt+1}
                wallet_amount = await this.getWalletBalance(user_id);
                return res.status(202).json(utility.DataEncrypt(JSON.stringify({ status: 202, message: 'Sorry ! You are not eligible for spin cashback ', data: responseData, wallet_amount:wallet_amount })));
                //return res.status(202).json({ status: 202, message: 'Sorry ! You are not eligible for spin cashback ', data: responseData });
            }
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Sorry ! You have not any remaing attempt ', data: [] })));
        }else{
            responseData = {'cashback_amount': 0, 'cashback_type': 'NA', 'details': '', 'attempts': attempt+1}
            wallet_amount = await this.getWalletBalance(user_id);
            return res.status(202).json(utility.DataEncrypt(JSON.stringify({ status: 202, message: 'Sorry ! You have not any remaing attempt ', data: responseData, wallet_amount:wallet_amount })));
            //return res.status(202).json({ status: 202, message: 'Sorry ! You have not any remaing attempt ', data: responseData });
        }
    
      }catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500,errors: validationErrors });
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors:'Internal Server Error', data:validationErrors })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));	
        //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));	
		  //return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }
    
    
    async getSpinnerData(req,res){
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id}=decryptedObject;
        const requiredKeys = Object.keys({ user_id });
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        try
        {
            const results = await this.db.userSpin.getAllData(user_id);
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: results })));
            //return res.status(200).json({ status: 200, message: 'Data Found', data: results });
        }
        catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          //const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
          //return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
        }
		//return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));	
        return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
      //return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));	
		  return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }
    
    
    async getCashbackUsers(req,res){
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const {user_id}=decryptedObject;
        const requiredKeys = Object.keys({ user_id });
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        try
        {
            const result = [];
            const results = await this.db.userSpin.getUserCashback(user_id);
            //return results;
            if(results!=null)
            {
                for(const data of results)
                {
                    const whereChk={id:data.user_id};
                    const UserAttribute=['first_name','last_name','mobile', 'state', 'district', 'profile_pic'];
                    const userRow = await this.db.user.getData(UserAttribute,whereChk);

                    result.push({
                        'cashback_amount': data.amount,
                        'user_id': data.user_id,
                        'first_name': userRow.first_name,
                        'last_name': userRow.last_name,
                        'mobile': userRow.mobile,
                        'state': userRow.state,
                        'district': userRow.district,
                        'profile_pic': userRow.profile_pic,
                        
                    });
                }
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data Found', data: result })));
                //return res.status(200).json({ status: 200, message: 'Data Found', data: result });
            }else{
                return res.status(201).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Data  Not Found', data: [] })));
                //return res.status(201).json({ status: 200, message: 'Data  Not Found', data: [] });
            }
        }
        catch (error) {
        logger.error(`Unable to find user: ${error}`);
        if (error.name === 'SequelizeValidationError') {
          //const validationErrors = error.errors.map((err) => err.message);
          //return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: 'Internal Server Error' })));
        }
		return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,  message: error.message ,data:[]})));	
        //return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
      return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400,  message: 'Bad request' ,data:[]})));	
		  //return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
    }


    
}

module.exports = new Spinner();