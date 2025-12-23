const { connect, config } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

const path = require('path');
require('dotenv').config();

class ProductPackage {
  db = {};

  constructor() {
    this.db = connect();
  }
  
   

    async getPackage(req, res) {
      const decryptedObject = utility.DataEncrypt(req.encReq);
      const { page } = decryptedObject;
    
      try {
          
          const pages = parseInt(page) || 1;
          const pageSize = 10;
    
          const result = await this.db.Package.getAllDataList(pages, pageSize);
    
          if (result && result.length > 0) {
              const formattedResult = result.map(pkg => {
                  let packageDetails = [];
    
                  if (typeof pkg.package_details === 'string') {
                      const cleanedDetails = pkg.package_details.replace(/^'|'$/g, '');
                      try {
                          const parsedDetails = JSON.parse(cleanedDetails);
                          if (typeof parsedDetails === 'object' && parsedDetails !== null) {
                              packageDetails = Object.values(parsedDetails);
                          }
                      } catch (parseError) {
                          console.error('Error parsing package_details JSON:', parseError);
                          packageDetails = []; 
                      }
                  } else if (typeof pkg.package_details === 'object') {
                      if (pkg.package_details !== null) {
                          packageDetails = Object.values(pkg.package_details);
                      }
                  } else {
                      console.warn('package_details is neither a string nor an object:', pkg.package_details);
                      packageDetails = [];
                  }
    
                  return {
                      id: pkg.id,
                      package_name: pkg.package_name,
                      package_amount: pkg.package_amount,
                      package_details: packageDetails,
                      without_gst: pkg.without_gst,
                      gst: pkg.gst,
                      created_on: pkg.created_on,
                      created_by: pkg.created_by,
                      modified_on: pkg.modified_on,
                      modified_by: pkg.modified_by,
                      deleted_on: pkg.deleted_on,
                      deleted_by: pkg.deleted_by,
                      status: pkg.status,
                      image: pkg.image
                  };
              });
    
            //   return res.status(200).json({status: 200, message: 'Package Found', data: formattedResult});
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({status: 200, message: 'Package Found', data: formattedResult})));
          } else {
            //   return res.status(404).json({status: 404, message: 'Package Not Found', data: []});
              return res.status(404).json(utility.DataEncrypt(JSON.stringify({status: 404, message: 'Package Not Found', data: []})));
          }
      } catch (err) {
          console.error('Error fetching packages:', err); // Log the error for debugging
    
          if (err.name === 'SequelizeValidationError') {
              const validationErrors = err.errors.map(error => error.message);
            //   return res.status(500).json({status: 500, errors: 'Internal Server Error', data:validationErrors });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({status: 500, errors: 'Internal Server Error', data:validationErrors })));
          }
    
        //   return res.status(500).json({status: 500, message: err.message, data: []});
          return res.status(500).json(utility.DataEncrypt(JSON.stringify({status: 500, message: err.message, data: []})));
      }
    }
    
    
    async packagePurchase(req, res, ipAddress) 
    {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, address } = decryptedObject;
        
        const requiredKeys = Object.keys({ user_id, address });
      
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
        //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        let t = await this.db.sequelize.transaction();
        
        try 
        {

            const env = config.env;
            const getCart = await this.db.Cart.findAll({
                where: {
                    user_id: user_id
                }
            });

            const cart_totalprice = getCart.reduce((sum, item) => {
                  const price = item.price || 0;
                  const quantity = item.quantity || 1;
                  return sum + (price * quantity);
                }, 0);
                
            
            if(cart_totalprice < 500)
            {
                // return res.status(400).json({ status: 400, message: 'Sorry! package amount should be minimum of 5000', data: []});
                return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Sorry! package amount should be minimum of 500', data: []})));
            }
            
            const amount = cart_totalprice;
            const order_id=utility.generateUniqueNumeric(7);
            const transaction_id = order_id;
            const order_no = `MR`+ order_id + Date.now();
            const currentDate = new Date();
            const gst_rate = parseFloat('18.00');
            const gst_amount = amount * parseFloat('18.00')/100;
            const originalAmount = amount + gst_amount;
            const amountWithoutgst = originalAmount - (originalAmount - originalAmount * (100/(100+gst_rate)));
            const distributionAmount = parseFloat(amount) - (parseFloat(amount)*0.12);
            let packageEntry = [];
            
            let walletbalance = await this.db.wallet.getWalletAmount(user_id);
            let walletAmount = amount;
            let cashback_rate = 30;
            let cashback_wallet_balance = await this.db.cashback.getCashbackAmount(user_id);
             
            let cashbackAmount = parseFloat(amount)*cashback_rate/100;
            
            if(cashback_wallet_balance>=cashbackAmount)
            {
                cashbackAmount = cashbackAmount;
                walletAmount = parseFloat(amount) - cashbackAmount;
            }else{
                cashbackAmount = 0;
            }
            
            if(walletbalance!==null && walletbalance > 0 && walletbalance >= parseInt(walletAmount))
            {
                if(cashback_wallet_balance>=cashbackAmount)
                {
                    cashbackAmount = cashbackAmount;
                    walletAmount = walletAmount;
                }else{
                    cashbackAmount = 0;
                }
                
                // Order Generate
                const orderData = {
                    user_id,
                    env:env, 
                    tran_type:'Debit',
                    tran_sub_type:'Package Purchase',
                    tran_for:'Package Purchase',
                    trans_amount: amount,
                    currency:'INR',
                    order_id,
                    order_status:'PENDING',
                    created_on:Date.now(),
                    created_by:user_id,
                    ip_address:ipAddress
                };
                
                const generateorder = await this.db.upi_order.insertData(orderData); 
                
                if(generateorder)
                {
                    
                      const userLevel = await this.getuserLvel(user_id);
                      
                    const purchaseData = { 
                        user_id, 
                        package_id: 1, 
                        level:userLevel,
                        amount: amount,
                        order_no: order_no,
                        order_date: Date.now(),
                        transaction_id: transaction_id,
                        order_status: 'PENDING',
                        address: address
                    };
                    packageEntry = await this.db.PackagePurchase.insertData(purchaseData, { transaction: t });
                }

                if(packageEntry)
                {
                    if(walletAmount > 0)
                    {
                        const walletData = {
                            transaction_id:transaction_id,
                            user_id,
                            env:env,
                            type:'Debit',
                            amount:walletAmount,
                            sub_type:'Package Purchase',
                            tran_for:'main'
                        };
                        
                        await this.db.wallet.insert_wallet(walletData, { transaction: t });
                    }
                  
                    if(cashbackAmount > 0){
                        const transactionData = {
                            transaction_id:transaction_id,
                            user_id:user_id,
                            env:env, 
                            type:'Debit',
                            sub_type: 'Package Purchase',
                            tran_for: 'cashback',
                            amount:cashbackAmount
                        };
                        await this.db.cashback.insert_cashback_wallet(transactionData, { transaction: t });

                    }

                    try {
                        for (let item of getCart) {
                            let purchaseProductData = { 
                                package_purchase_id: packageEntry.id, 
                                product_id: item.product_id,  
                                price: item.price,
                                qty: item.quantity,
                                total_price: item.totalprice
                            };
                    
                            let packageProductDetailsEntry = await this.db.PackagePurchaseDetails.insertData(purchaseProductData, { transaction: t });
                            
                            if (packageProductDetailsEntry) {

                                await this.db.Cart.destroy({
                                    where: { id: item.id },
                                    transaction: t
                                });
                            }
                        }
                    
                    } catch (error) {
                        await t.rollback();
                        console.error("Error processing cart items:", error);
                        throw error; 
                    }
                  
                }
            
                if(packageEntry)
                {
    
                  await this.db.upi_order.update(
                      {order_status:'SUCCESS' },
                      { where: { user_id:user_id,order_id:transaction_id,order_status:'PENDING' }, t }
                  );
                  
                  
                  await t.commit();
                //   return res.status(200).json({ status: 200, message: 'Package purchase successfully', data: packageEntry});
                  return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Package purchase successfully', data: packageEntry})));
                }
            }else{
               return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,error: 'You do not have sufficient wallet balance' })));
            //   return res.status(500).json({ status: 500,error: 'You do not have sufficient wallet balance' });
            }
           
        } catch (error) {
          await t.rollback();
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            // return res.status(500).json({ status: 500, errors:'Internal Server Error', data: validationErrors });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data: validationErrors })));
          }
      
            // return res.status(500).json({ status: 500, message: error.message, data: [] });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
        }

    }


    
    
    
    async packagePurchaseHistory(req, res) 
    {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, page } = decryptedObject;

        const requiredKeys = Object.keys({ user_id });
      
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined)) {
            //   return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
        
        try 
        {

            const pageSize = page || 1;
            const whereClause = {
              user_id: user_id
            }
    
            const packagePurchase = await paginate(this.db.PackagePurchase, {
              whereClause,
              order: [['id', 'DESC']],
              page: pageSize
            });

            const packagePurchaseItems = await Promise.all(packagePurchase.data.map(async (item) => {
              const productDetails = await this.db.PackagePurchaseDetails.findAll({
                where: {
                  package_purchase_id: item.id
                }
              });
            
              const productDetailsRows = await Promise.all(productDetails.map(async (packageItem) => {
                const product = await this.db.Product.findOne({
                  where: {
                    id: packageItem.product_id
                  }
                });
            
                const productImages = await this.db.ProductImages.findAll({
                  where: { product_id: packageItem.product_id }
                });
            
                const itemData = {
                  name: product.dataValues.name,
                  images: productImages
                };
            
                return {
                  ...packageItem.toJSON(),
                  ...itemData
                };
              }));
            
              const productData = {
                ...item.dataValues,
                items: productDetailsRows
              };
            
              return productData;
            }));
            
 
            // return res.status(200).json({ status: 200, message: 'Packages found successfully', data: packagePurchaseItems, totalPageCount: packagePurchase.totalPageCount});
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Packages found successfully', data: packagePurchaseItems, totalPageCount: packagePurchase.totalPageCount})));
           
        } catch (error) {
          await t.rollback();
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            // return res.status(500).json({ status: 500, errors:'Internal Server Error', data: validationErrors });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data: validationErrors })));

          }
      
            //   return res.status(500).json({ status: 500, message: error.message, data: [] });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
        }

    }
    
    
    async  packagePurchaseRequest(req, res) {
        
      const { from_date, to_date} = req;
      
      const requiredKeys = Object.keys({ from_date, to_date});
                
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
          return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
  
      try {
          const fromDate = new Date(from_date);
          const toDate = new Date(to_date);
          fromDate.setHours(0, 0, 0);
          toDate.setHours(23, 59, 59);
  
          const whereCondition = {
            created_on: {
              [Op.between]: [fromDate, toDate]
            }
          };
  
          const results = await this.db.ViewPackagePurchase.findAll({
            where: {
              ...whereCondition
            },
            order: [['id', 'DESC']]
          });
         
          if(results !==null){
              return res.status(200).json({ status: 200, message:'Successfully all record found', data: results });
          }
      
          return res.status(400).json({ status: 400, message:'Record not found',data:[] });
      } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json({ status: 500,errors: 'Internal Sever Error',data:validationErrors });
          }
        
          return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
          
    }


    async updatePackagePurchaseStatus(req, res, ipAddress) {
      const {purchase_id, remarks, status, modified_by} = req;
  
      const requiredKeys = Object.keys({ purchase_id, remarks, status });
            
      if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
      }
  
      try {
  
          const currentDate = new Date();

          const getPackagePurchase = await this.db.PackagePurchase.findOne({where: {id: purchase_id}});

          if(getPackagePurchase)
          {

            const user_id = getPackagePurchase.user_id;
            const amount = getPackagePurchase.amount;
            const old_transaction_id = getPackagePurchase.transaction_id;
            const env = config.env;
            const order_status = (status==1)?'ACCEPTED':'REJECTED'
            const where = { id:user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.getData(Attr, where);

            await this.db.PackagePurchase.update(
              { order_status:order_status, remarks: remarks, modified_by:modified_by, modified_on:currentDate.getTime()},
              { where: { id:purchase_id} }
            );

            const getCashbackWallet = await this.db.cashback.findOne({where: {
                    transaction_id: old_transaction_id,
                    user_id: user_id
                  }});
            if(parseInt(status) === 1)
            {
                const supplier_deduct = parseFloat(amount) - (parseFloat(amount) * 0.30);
                const distributionAmount = supplier_deduct - (supplier_deduct * 0.12);
                await this.rePurchaseIncome(env, user_id, distributionAmount, ipAddress, old_transaction_id );
                
                if(parseInt(amount) >= 1000)
                {
                    await this.performanceBonus(env, user_id, distributionAmount, ipAddress, old_transaction_id );
                }
                
                
                // if(getCashbackWallet)
                // {
                //     const cashbackAmount = getCashbackWallet.debit;

                //     let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(user_id);
                //     let closing_balance = parseFloat(opening_balance) + parseFloat(cashbackAmount);
                //     const refralData = {
                //       user_id:user_id,
                //       transaction_id: old_transaction_id,
                //       env: env, 
                //       type: 'Credit', 
                //       sub_type: 'Package Cashback', 
                //       opening_balance: opening_balance,
                //       credit: cashbackAmount,
                //       debit:0,
                //       closing_balance: closing_balance,
                //       tran_for: 'Package Cashback', 
                //       created_by:user_id,
                //       details: `Package purchase cashback received From ${userData.first_name} ${userData.last_name} (${userData.mlm_id})`,
                //       sender_id: user_id,
                //       level: 0,
                //       plan_id:0
                //     };
                        
                //     await this.db.ReferralIncome.insert(refralData);
                // }
            }

            if(parseInt(status) === 3)
            {
                const order_id = utility.generateUniqueNumeric(7);
                // Order Generate
                const orderData = {
                  user_id,
                  env:env, 
                  tran_type:'Credit',
                  tran_sub_type:'Package Purchase',
                  tran_for:'Refund',
                  trans_amount: amount,
                  currency:'INR',
                  order_id,
                  order_status:'PENDING',
                  created_on:Date.now(),
                  created_by:user_id,
                  ip_address:ipAddress
              };
              
              const generateorder = await this.db.upi_order.insertData(orderData); 
              
              if(generateorder && amount>0)
              {

                  const getWallet = await this.db.wallet.findOne({where: {
                    transaction_id: old_transaction_id,
                    user_id: user_id
                  }});

                  if(getWallet)
                  {
                    const walletData = {
                      transaction_id:order_id,
                      user_id,
                      env:env,
                      type:'Credit',
                      amount: getWallet.debit,
                      sub_type:'Package Purchase',
                      tran_for:'main'
                    };
                  
                    await this.db.wallet.insert_wallet(walletData);
                  }


                  if(getCashbackWallet)
                  {
                    const transactionData = {
                      transaction_id:order_id,
                      user_id:user_id,
                      env:env, 
                      type:'Credit',
                      sub_type: 'Package Purchase',
                      tran_for: 'cashback',
                      amount: getCashbackWallet.debit
                    };
                    await this.db.cashback.insert_cashback_wallet(transactionData);
                  }
                  
                  
              }
            }

            return res.status(200).json({ status: 200, message: 'Updated Successful.'});
          }else{
            return res.status(500).json({ status: 500, message: 'Wrong Credentials', data: [] });
          }
                  
      } catch (error) {
          if (error.name === 'SequelizeValidationError') {
              const validationErrors = error.errors.map((err) => err.message);
              return res.status(500).json({ status: 500, errors:'Internal Server Error', data:validationErrors });
          }
          
          return res.status(500).json({ status: 500,  message: error.message ,data:[]});
      }
    }
    
    
    async rePurchaseIncome(env, user_id, amount, ipAddress, transaction_id )
    {
          try {
    
            let sub_type = 'Package Purchase';
            let date = new Date();
            const referrals = await this.db.referral_idslevel.getRefralUser(user_id);
            let results = [];
            const where = { id:user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.getData(Attr, where);
            
            for (const referral of referrals) {
                const newLevel = referral.level;
                let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);
                let credit_amount = 0;
                const schemeAttr = ['level', 'package_percentage'];
                const schemeClause = {'status': 1, level: newLevel}
                const getSchemePercentage =  await this.db.SchemeLevel.getSchemePercentage(schemeAttr, schemeClause);
                if(getSchemePercentage)
                {
                    credit_amount = parseFloat(amount*(getSchemePercentage.package_percentage/100));
                }
               
                let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
                
                if(referral.ref_userid>0 && credit_amount>0)
                {
                    const order_id=utility.generateUniqueNumeric(7);
                    const orderData = {
                        user_id:referral.ref_userid,
                        env:env, 
                        tran_type:'Credit',
                        tran_sub_type:'Package Repurchase',
                        tran_for:'Repurchase',
                        trans_amount:credit_amount,
                        currency:'INR',
                        order_id,
                        order_status:'SUCCESS',
                        created_on:Date.now(),
                        created_by:user_id,
                        ip_address:ipAddress,
                        group_transaction_no: transaction_id
                    };
                  
                    const generateorder = await this.db.upi_order.insertData(orderData); 
    
                    if(generateorder){
                        const refralData = {
                          user_id:referral.ref_userid,
                          transaction_id: order_id,
                          env: env, 
                          type: 'Credit', 
                          sub_type: sub_type, 
                          opening_balance: opening_balance,
                          credit: credit_amount,
                          debit:0,
                          closing_balance: closing_balance,
                          tran_for: 'Package', 
                          created_by:user_id,
                          details: `${sub_type} Level Income ${newLevel} Received From ${userData.first_name} ${userData.last_name} (${userData.mlm_id})`,
                          sender_id: user_id,
                          level: newLevel,
                          plan_id:5
                        };
                        const result = await this.db.ReferralIncome.insert(refralData);
                        results.push(result);
                    }
                }
              
            }
            return results;
    
          } catch (error) {
            console.error(error.message);
            return  {'status': false};
        }
    }
    
    
    async performanceBonus(env, user_id, amount, ipAddress, transaction_id )
    {
          try {
    
            let sub_type = 'Performance Bonus';
            let date = new Date();
            const referrals = await this.db.referral_idslevel.findAll({
                where: {
                    'user_id': user_id,
                    'status': 1,
                    'level': {
                        [Op.lte]: 10
                    }
                }
            });
            
            let results = [];
            const where = { id:user_id };
            const Attr = ['first_name', 'last_name', 'mlm_id'];
            const userData = await this.db.user.getData(Attr, where);
            
            
            for (const referral of referrals) {
                const newLevel = referral.level;
                let opening_balance = await this.db.ReferralIncome.getLastIncomeclosingBalance(referral.ref_userid);
                let credit_amount = 0;
                // const schemeAttr = ['level', 'percentage'];
                // const schemeClause = {'status': 1, level: newLevel}
                // const getSchemePercentage =  await this.db.SchemeLevel.getSchemePercentage(schemeAttr, schemeClause);
                // if(getSchemePercentage)
                // {
                //     credit_amount = parseFloat(amount*(getSchemePercentage.package_percentage/100));
                // }
                
                credit_amount = parseFloat(amount*(1/100));
               
                let closing_balance = parseFloat(opening_balance) + parseFloat(credit_amount);
                
                if(referral.ref_userid>0 && credit_amount>0)
                {
                    const order_id=utility.generateUniqueNumeric(7);
                    const orderData = {
                        user_id:referral.ref_userid,
                        env:env, 
                        tran_type:'Credit',
                        tran_sub_type:sub_type,
                        tran_for:'Repurchase',
                        trans_amount:credit_amount,
                        currency:'INR',
                        order_id,
                        order_status:'SUCCESS',
                        created_on:Date.now(),
                        created_by:user_id,
                        ip_address:ipAddress,
                        group_transaction_no: transaction_id
                    };
                  
                    const generateorder = await this.db.upi_order.insertData(orderData); 
    
                    if(generateorder){
                        const refralData = {
                          user_id:referral.ref_userid,
                          transaction_id: order_id,
                          env: env, 
                          type: 'Credit', 
                          sub_type: sub_type, 
                          opening_balance: opening_balance,
                          credit: credit_amount,
                          debit:0,
                          closing_balance: closing_balance,
                          tran_for: 'Repurchase', 
                          created_by:user_id,
                          details: `${sub_type} Level Income ${newLevel} Received From ${userData.first_name} ${userData.last_name} (${userData.mlm_id})`,
                          sender_id: user_id,
                          level: newLevel,
                          plan_id:5
                        };
                        const result = await this.db.ReferralIncome.insert(refralData);
                        results.push(result);
                    }
                }
              
            }
            return results;
    
          } catch (error) {
            console.error(error.message);
            return  {'status': false};
        }
    }

          
        
        async UpdatePackage(req,res) {
        
         
           const decryptedObject = utility.DataDecrypt(req.encReq);
                const {   
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            package_id,
            modified_by } = decryptedObject;
        
        
              
                              
        let t = await this.db.sequelize.transaction();
        
        try {
          
         
         
        
            let  ProductData = {
        
            package_name,
            package_amount,
            package_details,
            without_gst,
            gst,
            package_id,
            modified_by,
            modified_on:new Date(),
              status:1
            }
        
          
        
            const WhereClause = {
              id:package_id
            }
            
            
        
           const results = await this.db.Package.UpdateData(ProductData, WhereClause,{ transaction: t });
            
            if (results) {
            
              await t.commit();
              return res.status(200).json(
            
                
                utility.DataEncrypt(JSON.stringify({  status: 200,  message: 'Package Updated successfully' ,data:results }))
                
                );
                
                
            } else {
              await t.rollback();
              return res.status(500).json(
                  
         
                utility.DataEncrypt(JSON.stringify({  status: 500,error: 'Failed to update' }))
                
                );
            }
        } catch (error) 
        {
             await t.rollback();
             
          logger.error(`Unable to find : ${error}`);
          if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err) => err.message);
            return res.status(500).json(
                
              
                utility.DataEncrypt(JSON.stringify( { status: 500,errors: validationErrors } ))
              
              );
          }
          return res.status(500).json(
           
               utility.DataEncrypt(JSON.stringify( { status: 500,message: error ,data:[] } ))
               
              );
        }
        
        
        
        return res.status(400).json(
            
             utility.DataEncrypt(JSON.stringify( { status: 400,  message: 'Bad request' ,data:[]} ))
            );
        
        
        
        }
        

            
        async AddPackage(fileName,req,res) {
    
          // const decryptedObject = utility.DataDecrypt(req.encReq);
           
           const {
               package_name,
               package_amount,
               package_details,
               without_gst,
               gst,
               created_by,
               image
               
           } = req;
       
          
             
            // console.log(fileName);
            //const filePath = `uploads/vendor/`+fileName;
          
            
            const filePath = `uploads/vendor/`+fileName;
               
        const ProductData = {
              
               package_name,
               package_amount,
               package_details,
               without_gst,
               gst,
               status:1,
               created_by,
               created_on:new Date(),
               image:filePath
             }
             
            
                               
         let t = await this.db.sequelize.transaction();
      
         
         try {
           
             const ProductData = {
              
               package_name,
               package_amount,
               package_details,
               without_gst,
               gst,
               status:1,
               created_by,
               created_on:new Date(),
               image:filePath
             }
             
            
            const results = await this.db.Package.insertData(ProductData, { transaction: t });
             
             if (results) {
             
               await t.commit();
               return res.status(200).json(
                 { status: 200,  message: 'Package Added successfully' ,data:results});
             } else {
               await t.rollback();
               return res.status(500).json(
                 { status: 500,error: 'Failed to create' });
             }
         } catch (error) 
         {
              await t.rollback();
              
         //  logger.error(Unable to find : ${error});
           if (error.name === 'SequelizeValidationError') {
             const validationErrors = error.errors.map((err) => err.message);
             return res.status(500).json(
               { status: 500,errors: validationErrors });
           }
           return res.status(500).json({ status: 500,  message: error.message ,data:[]});
         }
         return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
        }
        
        
        
        async getuserLvel(user_id){
            
            
            const [resultslevel, metadatas]  = await this.db.sequelize.query(`
                          WITH RankedData AS (
                            SELECT
                            m.category,
                            m.rank,
                            m.target_amt AS rank_achiever_amount,
                            m.target_amt AS target_achiever_amount,
                            m.level,
                            CASE
                            WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.target_amt
                            ELSE COALESCE(r.total_income, 0)
                            END AS received_income,
                            COALESCE(r.total_income, 0) AS total,
                            CASE
                            WHEN COALESCE(r.total_income, 0) >= m.target_amt THEN m.category
                            ELSE 'No Rank'
                            END AS rank_achiever_category,
                            ROW_NUMBER() OVER (PARTITION BY m.level ORDER BY m.target_amt ASC) AS row_num
                            FROM mst_rank_royality_category m
                            LEFT JOIN (
                            SELECT 
                            COALESCE(SUM(p.amount), 0) AS total_income,
                            rl.level
                            FROM view_plan_packages p
                            JOIN tbl_referral_idslevel rl ON p.user_id = rl.user_id
                            LEFT JOIN (
                            SELECT user_id, level, SUM(amount) AS pk_amount
                            FROM tbl_package_purchase
                            GROUP BY user_id, level
                            ) pk ON pk.user_id = rl.ref_userid AND pk.level = rl.level
                            
                            WHERE rl.ref_userid = :user_id
                            AND rl.level <= (
                            CASE 
                            WHEN (SELECT level FROM trans_royality_income WHERE user_id = :user_id ORDER BY level DESC LIMIT 1) IS NULL THEN 1
                            ELSE (SELECT COALESCE(level, 0) + 1 FROM trans_royality_income WHERE user_id = :user_id  ORDER BY level DESC LIMIT 1)
                            END
                            )
                            GROUP BY rl.level
                            ) r ON r.level = m.level
                            )
                            SELECT *
                            FROM RankedData
                            WHERE rank_achiever_category = 'No Rank'
                            OR row_num = 1  
                            ORDER BY 
                            CASE WHEN rank_achiever_category = 'No Rank' THEN 0 ELSE 1 END, 
                            level ASC, 
                            target_achiever_amount ASC limit 1;
                        `, {
                          raw: false,
                          replacements: { user_id },
                        });
                        
                        let  level=1;
                        if (resultslevel.length > 0) {
                           level = resultslevel[0].level; 
                          
                        }
                        return level;


        }
       
       
}

module.exports = new ProductPackage();