const { connect,baseurl } = require('../../config/db.config');
const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op,sequelize,fn, where } = require('sequelize');
const utility = require('../../utility/utility'); 


class appDashboard {

    db = {};

    constructor() {
        this.db = connect();
        
    }
    
    async getDashboard(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, categoryId } = decryptedObject;
   
        const requiredKeys = Object.keys({ user_id, categoryId });
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
      
        try {

            // User Profile
            const user_details = [];
            const userRow = await this.db.userDetails.findOne({ 
                attributes: ['first_name', 'last_name', 'email', 'mobile', 'first_name', 'plan_name', 'is_prime', 'profile_pic'], 
                where: {'id': user_id},
            });

            if (userRow) 
            {
                let planArray = [];
                
                if(userRow.dataValues.plan_name){
                    const planString = userRow.dataValues.plan_name;
                    planArray = planString.split(',');
                }

                const plansToCheck = ['Hybrid Prime', 'Booster Prime','Prime','Prime B'];

                const flagsObject = {};
                plansToCheck.forEach(plan => {
                    flagsObject[plan.toLowerCase()] = planArray.includes(plan) ? 1 : 0;
                });
                                    
                user_details.push({
                    ...userRow.dataValues,
                    flagsObject  
                });
            }

            // Recent App Use
            const recentApps = await this.db.recentAppUse.getData(
                ['user_id', 'title', 'image_url', 'functions'], 
                {'user_id': user_id}
            );

            // Get Banner
            let banners = await this.db.banner.getBanner(categoryId);
            let bannerData = [];
            if(banners)
            {
                bannerData = banners.map((bannerItem) => ({
                    id: bannerItem.id,
                    title: bannerItem.title,
                    img: baseurl+bannerItem.img,
                    type_id: bannerItem.type_id,
                    banner_for: bannerItem.banner_for,
                }));
            }

            // Get Wallet Balance
            const getRank = await this.db.sequelize.query(`
                SELECT m.rank, m.level
                  FROM trans_royality_income r
                  JOIN mst_rank_royality m ON r.level = m.level AND r.total_income >= m.target 
                  JOIN tbl_app_users u ON r.user_id = u.id 
                  WHERE u.id=${user_id}
                  ORDER BY m.level DESC
                  LIMIT 1
                `, {
                  raw: false,
                  type: this.db.sequelize.QueryTypes.SELECT,
            });

            let rank = 'Distributor';
            if(getRank.length>0){
                rank = getRank[0].rank;
            }
            
            const [walletBalance, cashbackBalance, primeBalance, affiliateBalance, voucher ] = await Promise.all([
                                                            this.db.wallet.getWalletAmount(user_id),
                                                            this.db.cashback.getCashbackAmount(user_id),
                                                            this.db.prime.getPrimeAmount(user_id),
                                                            this.db.ReferralIncome.getIncomeBalance(user_id),
                                                            this.db.coupon.getCouponCount(user_id)

                                                        ]);

            // Get Ebook List
            const minIdEbook = await this.db.ebookCategories.min('id');
            const maxIdEbook = await this.db.ebookCategories.max('id');
            const ebookCategoryId = Math.floor(Math.random() * (maxIdEbook - minIdEbook + 1)) + minIdEbook;
            const ebook = await this.db.view_ebook_list.findAll({
                where: {'category': ebookCategoryId},
                order: [['id', 'DESC']],
                limit: 10
            });

            // Get Affiliate
            let affiliateData = [];
            const minIdAffiliate = await this.db.affiliateLinkCategories.min('id');
            const maxIdAffiliate = await this.db.affiliateLinkCategories.max('id');
            const affiliateCategoryId = Math.floor(Math.random() * (maxIdAffiliate - minIdAffiliate + 1)) + minIdAffiliate;
            const affiliate = await this.db.affiliateLink.findAll({
                where: {'status': 1, 'category_id': affiliateCategoryId},
                order: [['id', 'DESC']],
                limit: 10
            });

            affiliateData = affiliate.map((affiliateItem) => ({
                id: affiliateItem.id,
                image: baseurl + affiliateItem.image,
                title: affiliateItem.title,
                category: affiliateItem.category_id,
                link: affiliateItem.link,
                status: affiliateItem.status,
                amount: affiliateItem.amount,
                discount: affiliateItem.discount,
                discount_amount: affiliateItem.discount_amount,
            }));

            // Get Total Users
            const userCount = await this.db.user.count();

            //Get Total Income
            const companyIncome = await this.db.ReferralIncome.findOne({
                attributes: [
                  [Sequelize.fn('SUM', Sequelize.col('credit')), 'amount']
                ],
                where: {
                  status: '1',
                  tran_for: 'income'
                }
              });
              
            //Get Affiliate Income
            const affiliateIncome = await this.db.ReferralIncome.findOne({
                attributes: [
                  [Sequelize.fn('SUM', Sequelize.col('credit')), 'amount']
                ],
                where: {
                  status: '1',
                  user_id: user_id,
                  tran_for: 'Repurchase',
                  sub_type: 'Invoice Income'
                }
              });
      
             
            const resData = {
                'userDetails': user_details,
                'recentAppUse': recentApps,
                'banners': bannerData,
                'walletBalance': parseFloat(walletBalance).toFixed(2),
                'cashbackBalance': parseFloat(cashbackBalance).toFixed(2),
                'primeBalance': parseFloat(primeBalance).toFixed(2),
                'affiliateBalance': parseFloat(affiliateBalance).toFixed(2),
                'voucher': voucher,
                'rank': rank,
                'ebook': ebook,
                'affiliateData': affiliateData,
                'totalUser': userCount,
                'totalIncome': (companyIncome)?companyIncome.dataValues.amount:0,
                'affiliateIncome': (affiliateIncome)?affiliateIncome.dataValues.amount:0

            }
            //return res.status(200).json({ status: 200, message: 'Details found', data: resData });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Details found', data: resData })));
              
          } catch (error) {

              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data:validationErrors })));
                //return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
              }
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
              //return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
      
	
    }
    
    
    async getMyDashboard(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id } = decryptedObject;
   
        const requiredKeys = Object.keys({ user_id });
            
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            //return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
      
        try {

            // User Profile
            const user_details = [];
            const userRow = await this.db.userDetails.findOne({ 
                attributes: ['first_name', 'last_name', 'email', 'mobile', 'first_name', 'plan_name', 'is_prime', 'profile_pic','ref_first_name', 'ref_last_name', 'ref_mobile', 'status', 'registration_date'], 
                where: {'id': user_id},
            });
            

            if (userRow) 
            {
                let planArray = [];
                
                if(userRow.dataValues.plan_name){
                    const planString = userRow.dataValues.plan_name;
                    planArray = planString.split(',');
                }

                const plansToCheck = ['Hybrid Prime', 'Booster Prime','Prime','Prime B'];

                const flagsObject = {};
                plansToCheck.forEach(plan => {
                    flagsObject[plan.toLowerCase()] = planArray.includes(plan) ? 1 : 0;
                });
                                    
                user_details.push({
                    ...userRow.dataValues,
                    flagsObject  
                });
            }

            
            const getRank = await this.db.sequelize.query(`
                SELECT m.rank, m.level
                  FROM trans_royality_income r
                  JOIN mst_rank_royality m ON r.level = m.level AND r.total_income >= m.target 
                  JOIN tbl_app_users u ON r.user_id = u.id 
                  WHERE u.id=${user_id}
                  ORDER BY m.level DESC
                  LIMIT 1
                `, {
                  raw: false,
                  type: this.db.sequelize.QueryTypes.SELECT,
            });

            let rank = 'Distributor';
            if(getRank.length>0){
                rank = getRank[0].rank;
            }
            
            const [walletBalance, cashbackBalance, primeBalance, affiliateBalance, voucher, epinwallet, totalIncome ] = await Promise.all([
                                                            this.db.wallet.getWalletAmount(user_id),
                                                            this.db.cashback.getCashbackAmount(user_id),
                                                            this.db.prime.getPrimeAmount(user_id),
                                                            this.db.ReferralIncome.getIncomeBalance(user_id),
                                                            this.db.coupon.getCouponCount(user_id),
                                                            this.db.epinWallet.getWalletAmount(user_id),
                                                            this.db.ReferralIncome.getTotalIncome(user_id)

                                                        ]);


             
            const resData = {
                'first_name': userRow.first_name,
                'last_name': userRow.last_name,
                'mlm_id': userRow.mlm_id,
                'mobile': userRow.mobile,
                'email': userRow.email,
                'ref_first_name': userRow.ref_first_name,
                'ref_last_name': userRow.ref_last_name,
                'ref_mobile': userRow.ref_mobile,
                'wallet_balance': walletBalance,
                'cashbackBalance': cashbackBalance,
                'primeBalance': primeBalance,
                'total_earning': totalIncome,
                'royality_income': 0,
                'reward_income': 0,
                'total_walletIncome': affiliateBalance,
                'epin_wallet': epinwallet,
                'activation_date': userRow.registration_date,
                'registration_date': userRow.registration_date,
                'user_status': (userRow.status==1)?'Active':'Incative',
                'voucher': voucher,
                'rank': rank,
                'plan_name': userRow.plan_name

            }
            //return res.status(200).json({ status: 200, message: 'Details found', data: resData });
            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Details found', data: resData })));
              
          } catch (error) {

              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data:validationErrors })));
                //return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
              }
      
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
              //return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
      
	
    }
    
    async getDashboardAdmin(req, res) {
      
        try {

            let today = new Date();
            let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            let currentFirstDate = new Date(today.setHours(0, 0, 0, 0));
            let currentEndDate = new Date(today.setHours(23, 59, 59, 999));

            
            // Recharge

            const [totalRCount, totalRAmount, totalSuccessCount, totalSuccessAmount, totalFailedCount, totalFailedAmount, totalBillPaymentCount, totalBillPayment, totalUser, totalTodayJoindUser, totalThisWeekJoindUser, totalThisMonthJoindUser, totalRedeem, totalTodayRedeem, totalThisWeekRedeem, totalThisMonthRedeem, totalLeads, totalTodayLeads, totalThisWeekLeads, totalThisMonthLeads ] = await Promise.all([
                this.db.recharge.getAllRechargeCount(),
                this.db.recharge.getAllRechargeAmount(),
                this.db.recharge.getAllRechargeStatusCount(1),
                this.db.recharge.getAllRechargeStatusAmount(1),
                this.db.recharge.getAllRechargeStatusCount(3),
                this.db.recharge.getAllRechargeStatusAmount(3),
                this.db.bbpsBillPayment.getTotalBillPaymentCount(),
                this.db.bbpsBillPayment.getTotalBillPayment(),
                this.db.user.getAllUserCount({'status': [0,1]}),
                this.db.user.getAllUserCount({'created_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),
                this.db.user.getAllUserCount({'created_on': {
                    [Op.between]: [utility.getStartOfWeek(today), utility.getEndOfWeek(today)]
                }}),
                this.db.user.getAllUserCount({'created_on': {
                    [Op.between]: [firstDay, lastDay]
                }}),
                this.db.Redeem.getAllRedeemAmount({'status': 1}),
                this.db.Redeem.getAllRedeemAmount({'status': 1, 'updated_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),
                this.db.Redeem.getAllRedeemAmount({'status': 1, 'updated_on': {
                    [Op.between]: [utility.getStartOfWeek(today), utility.getEndOfWeek(today)]
                }}),
                this.db.Redeem.getAllRedeemAmount({'status': 1, 'updated_on': {
                    [Op.between]: [firstDay, lastDay]
                }}),
                this.db.leadUserAction.getAllCount({status:2}),
                this.db.leadUserAction.getAllCount({status:2, 'modified_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),
                this.db.leadUserAction.getAllCount({status:2, 'modified_on': {
                    [Op.between]: [utility.getStartOfWeek(today), utility.getEndOfWeek(today)]
                }}),
                this.db.leadUserAction.getAllCount({status:2, 'modified_on': {
                    [Op.between]: [firstDay, lastDay]
                }})
            ]);


            const getUsers = await this.db.user.findAll({
                where: {
                    'created_on': {
                        [Op.between]: [currentFirstDate, currentEndDate]
                    }
                },
  
            });

            const palyoutData = await this.db.Redeem.findAll({
                attributes: [
                  [Sequelize.fn('DATE', Sequelize.col('created_on')), 'date'],
                  [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount']
                ],
                group: ['date'],
                raw: true,
                order: [[Sequelize.fn('DATE', Sequelize.col('created_on')), 'ASC']],
                limit: 7
              });
             
            const resData = {
                'totalRCount': totalRCount,
                'totalRAmount': parseFloat(totalRAmount).toFixed(2),
                'totalSuccessCount': totalSuccessCount,
                'totalSuccessAmount': parseFloat(totalSuccessAmount).toFixed(2),
                'totalFailedCount': totalFailedCount,
                'totalFailedAmount': parseFloat(totalFailedAmount).toFixed(2),
                'totalBillPaymentCount': totalBillPaymentCount,
                'totalBillPayment': parseFloat(totalBillPayment).toFixed(2),
                'totalUser': totalUser,
                'totalTodayJoindUser': totalTodayJoindUser,
                'totalThisWeekJoindUser': totalThisWeekJoindUser,
                'totalThisMonthJoindUser': totalThisMonthJoindUser,
                'totalRedeem': parseFloat(totalRedeem).toFixed(2),
                'totalTodayRedeem': totalTodayRedeem,
                'totalThisWeekRedeem': totalThisWeekRedeem,
                'totalThisMonthRedeem': totalThisMonthRedeem,
                'totalLeads': totalLeads,
                'totalTodayLeads': totalTodayLeads,
                'totalThisWeekLeads': totalThisWeekLeads,
                'totalThisMonthLeads': totalThisMonthLeads,
                'todayUsers': getUsers,
                'palyoutData': palyoutData,
                'current_date': new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(today)
            }

            return res.status(200).json({ status: 200, message: 'Details found', data: resData });
              
          } catch (error) {

              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
              }
      
              return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
      
	
    }
    
    
    async getDashboardAPI(req, res) {
      
        try {

            let today = new Date();
          


            let currentFirstDate = new Date(today.setHours(0, 0, 0, 0));
            let currentEndDate = new Date(today.setHours(23, 59, 59, 999));

            let currentFDate = new Date(today);
            currentFDate.setDate(today.getDate() - 14);
            
            // Recharge

            const [totalRCount, totalRAmount, totalSuccessCount, totalSuccessAmount, totalFailedCount, totalFailedAmount, todaysuccesscount, todayfailurecount, todayholdcount,last15DaysRSucess, last15DaysRFail,
                totalBillPaymentCount, totalBillPayment, todaysBillSuccess, todaysBillFail, todaysBillHold,last15DaysbbpsSucess, last15DaysbbpsFail, last15DaysbbpsHold,
                totalPrimeUser, todayTotalPrime, totalUser, totalTodayJoindUser, totalBlockUser, todayBlockUser, totalSendMoney, todaySendMoney, totalAddMoney, todayAddMoney, last15daysSendMoney, last15daysAddMoney,
                manual_addmoney, //gettotal
            ] = await Promise.all([
                this.db.recharge.getAllRechargeCount(),
                this.db.recharge.getAllRechargeAmount(),
                this.db.recharge.getAllRechargeStatusCount(1),
                this.db.recharge.getAllRechargeStatusAmount(1),
                this.db.recharge.getAllRechargeStatusCount(3),
                this.db.recharge.getAllRechargeStatusAmount(3),
                this.db.recharge.getTodaysRechargeSuccessCount(),
                this.db.recharge.getTodaysRechargeFailureCount(),
                this.db.recharge.getTodaysRechargeHoldCount(),
               // this.db.recharge.getLast15DaysRSuccessCount(),
                this.db.recharge.getLast15DaysRCount({ 'recharge_status': 'SUCCESS','created_on': {
                    [Op.between]: [currentFDate, currentEndDate]
                }
            }),

            this.db.recharge.getLast15DaysRCount({ 'recharge_status': 'FAILURE','created_on': {
                [Op.between]: [currentFDate, currentEndDate]
            }
        }),

        this.db.bbpsBillPayment.getTotalBillPaymentCount(),
        this.db.bbpsBillPayment.getTotalBillPayment(),
        this.db.bbpsBillPayment.getTodayBillSucess(),
        this.db.bbpsBillPayment.getTodayBillFail(),
        this.db.bbpsBillPayment.getTodayBillHold(),
        this.db.bbpsBillPayment.getLast15DaysBBPSCount({ 'payment_status': 'SUCCESS','created_on': {
            [Op.between]: [currentFDate, currentEndDate]
        }
    }),

    this.db.bbpsBillPayment.getLast15DaysBBPSCount({ 'payment_status': 'FAILURE','created_on': {
        [Op.between]: [currentFDate, currentEndDate]
    }
}),

this.db.bbpsBillPayment.getLast15DaysBBPSCount({ 'payment_status': 'HOLD','created_on': {
    [Op.between]: [currentFDate, currentEndDate]
}
}), 

    this.db.userDetails.getTotalPrime(),
                this.db.userDetails.getTodayPrime(),

                this.db.user.getAllUserCount({'status': [0,1]}),
                this.db.user.getAllUserCount({'created_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),

                this.db.user.getAllUserCount({'status': [0]}),
                this.db.user.getAllUserCount({'status': [0],'created_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),


                this.db.wallet_transfer.getTotalSendMoney({'status': [1]}),
                this.db.wallet_transfer.getTotalSendMoney({'status': [1],'created_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),

                this.db.wallet.getTotalAddMoney({'status': [1], 'sub_type': 'Add Money'}),

                this.db.wallet.getTotalAddMoney({'status': [1], 'sub_type': 'Add Money', 'created_on': {
                    [Op.between]: [currentFirstDate, currentEndDate]
                }}),

                this.db.wallet.getTotalSendMoney({'created_on': {
                    [Op.between]: [currentFDate, currentEndDate]
                }}),

                this.db.wallet.getTotalAddMoney({'status': [1], 'sub_type': 'Add Money','created_on': {
                    [Op.between]: [currentFDate, currentEndDate]
                }}),

                this.db.add_money.getManualAddMoney({'status': [1]}),
               //this.db.wallet_transafer.gettotal({'status': [1]})
              
            ]);

           
             
            const resData = {
                'totalRCount': totalRCount,
                'totalRAmount': totalRAmount,
                'totalSuccessCount': totalSuccessCount,
                'totalSuccessAmount': totalSuccessAmount,
                'totalFailedCount': totalFailedCount,
                'totalFailedAmount': totalFailedAmount,
                'todaysuccesscount': todaysuccesscount,
                'todayfailurecount': todayfailurecount,
                'todayholdcount': todayholdcount,
               'last15DaysRSucess': last15DaysRSucess,
                'last15DaysRFail': last15DaysRFail,

                
                'totalBillPaymentCount': totalBillPaymentCount,
                'totalBillPayment': totalBillPayment,
                'todaysBillSuccess': todaysBillSuccess,
                'todaysBillFail': todaysBillFail,
                'todaysBillHold':todaysBillHold,
                'last15DaysbbpsSucess': last15DaysbbpsSucess,
                'last15DaysbbpsFail': last15DaysbbpsFail,
                'last15DaysbbpsHold': last15DaysbbpsHold,

                'totalPrimeUser': totalPrimeUser,
                'todayTotalPrime':todayTotalPrime,
                'totalUser': totalUser,
                'totalTodayJoindUser': totalTodayJoindUser,
                'totalBlockUser': totalBlockUser,
                'todayBlockUser': todayBlockUser,
                'totalSendMoney': totalSendMoney,

                'todaySendMoney': todaySendMoney,
                'totalAddMoney': totalAddMoney,
                'todayAddMoney': todayAddMoney,

                'last15daysSendMoney': last15daysSendMoney,
                'last15daysAddMoney':last15daysAddMoney,

                'manual_addmoney': manual_addmoney,
              //  'gettotal': gettotal,


                'current_date': new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(today)
            }

            return res.status(200).json({ status: 200, message: 'Details found', data: resData });
              
          } catch (error) {

              if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
              }
      
              return res.status(500).json({ status: 500, message: error.message, data: [] });
        }
      
	
    }

    
}

   

module.exports = new appDashboard();