const cron = require('node-cron');
const cronJobAddMoney = require('./add_money/AddMoney.cron.js');
const cronJobidslevel = require('./referral/idslevel.cron.js');
const cronWhatsapp = require('./whatsapp/whatsapp.cron.js');
const cronJobNotifocation = require('./notification/fcm_notification.cron.js');
const cronJobRoyality = require('./referral/royality.cron.js');
const cronJobPrimeRoyality = require('./referral/PrimeRoyality.cron.js');
const cycleIncomeCronJob = require('./referral/cycleIncome.cron.js');
const cronJobPortfolio = require('./referral/portfolio.cron.js');
const cronJobRechargePanel = require('./recharge/recharge.cron.js');
const cronleadUserAction = require('./leads/leads_user_action.cron.js');
const cronMessaging = require('./notification/messaging_service.cron');
const cronJobShopping = require('./orders/order.cron.js');

class CronJobHandler {
  constructor() {
    // Schedule the cron job in the constructor

    /************************************ADD MONEY JOB**************************************************/
    //HDFC UPI
    //cron.schedule('* 6-23 * * *', cronJobAddMoney.WalletJob.bind(cronJobAddMoney));

    //CCAvenue Payment gateway
    // cron.schedule('* 6-23 * * *', cronJobAddMoney.WalletJobCCAvenue.bind(cronJobAddMoney));


    /************************************REFER ID JOB**************************************************/
    cron.schedule('* 5-23 * * *', cronJobidslevel.ReferIDJob.bind(cronJobidslevel));


    /************************************REFERRAL JOB**************************************************/
    
	cron.schedule('25 1 * * 1-5', cycleIncomeCronJob.hybridCycles.bind(cycleIncomeCronJob), {
      timezone: 'Asia/Kolkata'
    });
    


    cron.schedule('10 2 * * 1-5', cycleIncomeCronJob.BonusRePurchaseIncome.bind(cycleIncomeCronJob), {
      timezone: 'Asia/Kolkata'
    });
	

 cron.schedule('12 9 * * 1-5', cycleIncomeCronJob.BonusRePurchaseIncome2.bind(cycleIncomeCronJob), {
      timezone: 'Asia/Kolkata'
    });
 


 








    //cron.schedule('40 23 * * *', cronJobPortfolio.CompanyportfolioJob.bind(cronJobPortfolio));



    // cron.schedule('45 0 * * *', cronJobRoyality.ActiveRoyalityUser.bind(cronJobRoyality));

    //cron.schedule('25 1 2-30/2 * *', cronJobRoyality.Royality.bind(cronJobRoyality));
    //cron.schedule('36 23 2-30/2 * *', cronJobPrimeRoyality.PrimeRoyality.bind(cronJobPrimeRoyality));


    /***************************************END REFERRAL JOB***********************************************/


    /***************************************START ROYALITY JOB***********************************************/


    /*  cron.schedule('10 4 * * *', cronJobRoyality.SilverRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('20 4 * * *', cronJobRoyality.GoldRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('30 4 * * *', cronJobRoyality.CarFundRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('40 4 * * *', cronJobRoyality.PlatinumRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('50 4 * * *', cronJobRoyality.DiamondRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('0 5 * * *', cronJobRoyality.MobileFundRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('10 5 * * *', cronJobRoyality.HouseFundRankRoyalityCategory.bind(cronJobRoyality));
      cron.schedule('20 5 * * *', cronJobRoyality.TravelFundRankRoyalityCategory.bind(cronJobRoyality));*/


    /***************************************END ROYALITY JOB***********************************************/


    // Run the job every 10 minutes, between 6 AM and midnight
    //cron.schedule('*/10 6-23 * * *', cronJobRechargePanel.priorityJob.bind(cronJobRechargePanel));


    //  cron.schedule('* 6-23 * * *', cronleadUserAction.LeadsRepurchaseJob.bind(cronleadUserAction));


    // cron.schedule('* 6-23 * * *', cronJobNotifocation.NotificationJob.bind(cronJobNotifocation));
    // cron.schedule('* 6-23 * * *', cronJobNotifocation.NotificationJobAdmin.bind(cronJobNotifocation));

    //  cron.schedule('* 6-23 * * *', cronMessaging.shootMessages.bind(cronMessaging));


    // cron.schedule('*/1 6-23 * * *', cronJobShopping.OrderRepurchaseJob.bind(cronJobShopping));






  }


}

// Export an instance of the class to be used in other files
module.exports = new CronJobHandler();
