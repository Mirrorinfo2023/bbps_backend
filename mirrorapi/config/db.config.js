const { Sequelize, Model, DataTypes, Utils,Op } = require("sequelize");
const logger = require('../logger/api.logger');
var config = require('./config.json');

// const baseurl= 'https://secure.mirror.org.in/';
const baseurl= 'http://localhost:4223/';

const timeZone = 'Asia/Kolkata';
const connect = () => {

    const hostName = config.host;
    const userName = config.username;
    const password = config.password;
    const database = config.database;
    const dialect = config.dialect;

    const sequelize = new Sequelize(database, userName, password, {
        host: hostName,
        dialect: dialect,
        timezone: '+05:30',
        operatorsAliases: {
			$gt: Sequelize.Op.gt,
			$lt: Sequelize.Op.lt,
			$eq: Sequelize.Op.eq,
			$ne: Sequelize.Op.ne,
			// ... and so on
		  },
        pool: {
            max: 100,
            min: 0,
            acquire: 30000,
            idle: 1000,
            waitForConnections: true, 
            connectionLimit: 10, 
            queueLimit: 100 
        },
         dialectOptions: {
             connectTimeout: 30000
        //connectionLimit: 500, 
        //acquireTimeout: 30000, 
        }
        
        
    });
    
sequelize
  .authenticate()
  .then(() => {
    //console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

    const db = {};
	db.sequelize = sequelize;
	db.Sequelize = Sequelize;	
	//Model
	db.log = require("../model/log/log.model")(sequelize, DataTypes, Model);
	db.user = require("../model/user/user.model")(sequelize, DataTypes, Model,Op);
	
	
    db.userIntrestCategory = require("../model/user/user_intrest_category.model")(sequelize, DataTypes, Model);
    db.userIntrest = require("../model/user/user_intrest.model")(sequelize, DataTypes, Model);
      
	db.countries = require("../model/countries/countries.model")(sequelize, DataTypes, Model);
	db.state = require("../model/state/state.model")(sequelize, DataTypes, Model);
	db.city = require("../model/city/city.model")(sequelize, DataTypes, Model);
	db.city = require("../model/city/city.model")(sequelize, DataTypes, Model);
	db.sms = require("../model/sms/sms.model")(sequelize, DataTypes, Model);
	db.add_money = require("../model/add_money/add_money.model")(sequelize, DataTypes, Model);
	db.upi_order = require("../model/add_money/upi_order.model")(sequelize, DataTypes, Model);
  
  db.wallet = require("../model/wallet/wallet.model")(sequelize, DataTypes, Model);
  db.cashback = require("../model/wallet/cashback_wallet.model")(sequelize, DataTypes, Model);
  db.prime = require("../model/wallet/prime_wallet.model")(sequelize, DataTypes, Model);
  db.affiliate = require("../model/wallet/affiliate_wallet.model")(sequelize, DataTypes, Model);
  db.epinWallet = require("../model/wallet/epin_wallet.model")(sequelize, DataTypes, Model);
  db.viewEpinWallet = require("../model/report/view_epin_wallet.model")(sequelize, DataTypes, Model);
  
  db.couponMstr = require("../model/coupon/couponMstr.model")(sequelize, DataTypes, Model);
  db.coupon = require("../model/coupon/coupon.model")(sequelize, DataTypes, Model);
  db.cashbackPlan = require("../model/cashback_plan/cashbackPlan.model")(sequelize, DataTypes, Model);
  db.panel = require("../model/recharge/panel.model")(sequelize, DataTypes, Model);
  
  db.recharge = require("../model/recharge/recharge.model")(sequelize, DataTypes, Model);
  db.rechargeServices = require("../model/recharge/rechargeServices.model")(sequelize, DataTypes, Model);
  db.serviceOperator = require("../model/operator/serviceOperator.model")(sequelize, DataTypes, Model);  
  db.rechargeServiceOperator = require("../model/recharge/rechargeServiceOperator.model")(sequelize, DataTypes, Model); 
  db.rechargeServiceDiscount = require("../model/recharge/rechargeServiceDiscount.model")(sequelize, DataTypes, Model);
  db.mobileOperator = require("../model/operator/mobileOperator.model")(sequelize, DataTypes, Model);
  db.spinner = require("../model/spinner/spinner.model")(sequelize, DataTypes, Model);
  db.userSpin = require("../model/spinner/user_spin_outcome.model")(sequelize, DataTypes, Model);
  
  db.wallet_transfer = require("../model/send_money/wallet_transafer.model")(sequelize, DataTypes, Model);
  db.passbook = require("../model/passbook/passbook.model")(sequelize, DataTypes, Model);
  db.viewpassbook = require("../model/passbook/view_passbook.model")(sequelize, DataTypes, Model);
  db.mpin = require("../model/mpin/mpin.model")(sequelize, DataTypes, Model);
  
  db.kyc = require("../model/kyc/kyc.model")(sequelize, DataTypes, Model);
  
  /**********************START*******************Business Page******************************START*************************/
  db.page = require("../model/page/page.model")(sequelize, DataTypes, Model);
  db.banner = require("../model/banner/banner.model")(sequelize, DataTypes, Model);
  db.bannerCategory = require("../model/banner/bannerCategory.model")(sequelize, DataTypes, Model);
  db.view_banner = require("../model/banner/view_banner.model")(sequelize, DataTypes, Model);
  /**************************************END*****Business Page**************************END**********************/
  
  /**********************START*******************REFERRAL******************************START*************************/
  
   db.PlanPurchase = require("../model/referral/PlanPurchase.model")(sequelize, DataTypes, Model);
   db.referral_idslevel = require("../model/referral/referral_idslevel.model")(sequelize, DataTypes, Model);
   db.ReferralIncome = require("../model/referral/ReferralIncome.model")(sequelize, DataTypes, Model);
   db.PlanLevel = require("../model/referral/PlanLevel.model")(sequelize, DataTypes, Model);
   db.Redeem = require("../model/referral/Redeem.model")(sequelize, DataTypes, Model);
   db.RoyalityIncome = require("../model/referral/RoyalityIncome.model")(sequelize, DataTypes, Model);
   
   db.RankRoyality = require("../model/referral/RankRoyality.model")(sequelize, DataTypes, Model);
   db.CycleIncome = require("../model/referral/CycleIncome.model")(sequelize, DataTypes, Model);
   db.CompanyPortfolio = require("../model/referral/CompanyPortfolio.model")(sequelize, DataTypes, Model);
   db.RoyalityPrime = require("../model/referral/RoyalityPrime.model")(sequelize, DataTypes, Model);
  
  db.primeUserReport = require("../model/report/view_prime_user_report.model")(sequelize, DataTypes, Model);
  db.incomeReport = require("../model/report/view_income_report.model")(sequelize, DataTypes, Model);
  db.distributionReport = require("../model/report/view_user_distribution.model")(sequelize, DataTypes, Model);
   
  
  /**************************************END****REFERRAL*************************END**********************/
  
 
  
  /**********************START*******************Feedback******************************START*************************/
  db.feedbackCategory = require("../model/feedback/feedbackCategory.model")(sequelize, DataTypes, Model);
  db.feedbackReason = require("../model/feedback/feedbackReason.model")(sequelize, DataTypes, Model);
  db.feedback = require("../model/feedback/feedback.model")(sequelize, DataTypes, Model);
  db.feedback_view = require("../model/feedback/feedback_view.model")(sequelize, DataTypes, Model);
  
  /**********************END*******************Feedback******************************END*************************/
  
  
  db.userDetails = require("../model/report/user_details.model")(sequelize, DataTypes, Model);
  db.userSummary = require("../model/report/user_summary.model")(sequelize, DataTypes, Model);
  db.add_money_view = require("../model/add_money/view_add_money.model")(sequelize, DataTypes, Model);
  db.send_money_view = require("../model/send_money/send_money_view.model")(sequelize, DataTypes, Model);
  db.rechargeReport = require("../model/report/recharge_report.model")(sequelize, DataTypes, Model);
  db.smsView = require("../model/report/sms.model")(sequelize, DataTypes, Model);
  db.viewCashback = require("../model/report/cashback_report.model")(sequelize, DataTypes, Model);
  db.viewPrimeWallet = require("../model/report/prime_wallet_report.model")(sequelize, DataTypes, Model);
  db.billPaymentReport = require("../model/report/bill_payment.model")(sequelize, DataTypes, Model);
  
  /**********************START*******************LOG******************************START*************************/
  db.recentAppUse = require("../model/log/recent_use_app.model")(sequelize, DataTypes, Model);
  //db.userAction = require("../model/log/user_action.model")(sequelize, DataTypes, Model);
   db.userTask = require("../model/log/user_task.model")(sequelize, DataTypes, Model);
   db.userAdds = require("../model/log/user_adds.model")(sequelize, DataTypes, Model);
    db.test = require("../model/log/test.model")(sequelize, DataTypes, Model);
    db.userService = require("../model/log/user_service.model")(sequelize, DataTypes, Model);
  /**********************END*******************LOG******************************END*************************/
    
 
  /**************************************START****NOTIFICATION*************************START**********************/
  db.notification_view = require("../model/notification/notification_view.model")(sequelize, DataTypes, Model);
  db.notification = require("../model/notification/notification.model")(sequelize, DataTypes, Model);
  db.notificationCategory = require("../model/notification/notificationCategory.model")(sequelize, DataTypes, Model);
  
  db.notificationAppType = require("../model/notification/notificationAppType.model")(sequelize, DataTypes, Model);
  db.fcm_notification = require("../model/notification/fcm_notification.model")(sequelize, DataTypes, Model);
  db.log_app_notification = require("../model/notification/log_app_notification.model")(sequelize, DataTypes, Model);

  /**************************************END****NOTIFICATION*************************END***************************/
  
  
  /*********************************START *WHATSAPP Notifications******************************************* */
  db.whatsapp_notification = require("../model/whatsapp/whatsapp.model")(sequelize, DataTypes, Model);
  /**********************************END WHATSAPP Notifications******************************************* */
  
  /**INSUARANCE**/
  db.insuarnce = require("../model/insurance/insurance.model")(sequelize, DataTypes, Model);
  db.viewInsuarnce = require("../model/insurance/view_insurance.model")(sequelize, DataTypes, Model);
  db.insuarnce_user_track = require("../model/insurance/insurance_user_track.model")(sequelize, DataTypes, Model);
  db.view_insurance_user_track_details = require("../model/insurance/view_insurance_user_track_details.model")(sequelize, DataTypes, Model);
 /**INSUARANCE END**/


  /*********************************START LEADS******************************************** */
  db.leadsCategory = require("../model/leads/categories.model")(sequelize, DataTypes, Model);
  db.leads = require("../model/leads/lead.model")(sequelize, DataTypes, Model);
  db.leadsDetails = require("../model/leads/lead_details.model")(sequelize, DataTypes, Model);
  db.viewLeadsDetails = require("../model/leads/view_leads_details.model")(sequelize, DataTypes, Model);
  db.lead_user_track = require("../model/leads/lead_user_track.model")(sequelize, DataTypes, Model);
  //db.likeShare = require("../model/leads/like_share.model")(sequelize, DataTypes, Model);
  
  db.faqs = require("../model/leads/faqs.model")(sequelize, DataTypes, Model);
  db.leadUserAction = require("../model/leads/lead_user_action.model")(sequelize, DataTypes, Model);
  db.viewLeadUserAction = require("../model/leads/view_lead_user_action.model")(sequelize, DataTypes, Model);
  db.userLeadRemarks = require("../model/leads/user_lead_remarks.model")(sequelize, DataTypes, Model);
  
  db.userForm = require("../model/leads/user_form.model")(sequelize, DataTypes, Model);
  db.userFormDetails = require("../model/leads/user_form_details.model")(sequelize, DataTypes, Model);
  db.viewUserForm = require("../model/leads/view_lead_user_form.model")(sequelize, DataTypes, Model);
  /**********************************END LEADS******************************************* */
  
  
  /*********************************START Graphics******************************************** */
  db.graphicsCategory = require("../model/graphics/graphicsCategories.model")(sequelize, DataTypes, Model);
  db.graphics = require("../model/graphics/graphics.model")(sequelize, DataTypes, Model);
  db.likeShare = require("../model/graphics/like_share.model")(sequelize, DataTypes, Model);
  /**********************************END Graphics******************************************* */
  
  db.meeting = require("../model/meeting/meeting.model")(sequelize, DataTypes, Model);
  db.meetingDetails = require("../model/meeting/meeting_details.model")(sequelize, DataTypes, Model);
  db.viewMeetingDetails = require("../model/meeting/view_meeting_details.model")(sequelize, DataTypes, Model);
  
  db.userProfileDetails = require("../model/user/user_profile_details.model")(sequelize, DataTypes, Model);
  
  db.logSystemCreditDebit = require("../model/wallet/log_credit_debit.model")(sequelize, DataTypes, Model);

  db.setting = require("../model/setting/setting.model")(sequelize, DataTypes, Model);
  db.frequentQuestion = require("../model/feedback/frequentQuestion.model")(sequelize, DataTypes, Model);
  db.pincode = require("../model/pincode/pincode.model")(sequelize, DataTypes, Model);
  
  db.affiliateToWallet = require("../model/referral/affililateToWallet.model")(sequelize, DataTypes, Model);
  db.view_affiliateToWallet = require("../model/referral/view_affiliate_to_wallet.model")(sequelize, DataTypes, Model);
  
  db.bbpsBillerInfo = require("../model/bill_pay/bbps_biller_info.model")(sequelize, DataTypes, Model);
  db.bbpsBillFetch = require("../model/bill_pay/bbps_bill_fetch.model")(sequelize, DataTypes, Model);
  db.bbpsBillPayment = require("../model/bill_pay/bbps_bill_payment.model")(sequelize, DataTypes, Model);
  
   db.qrcode = require("../model/user/qrcode.model")(sequelize, DataTypes, Model);
   
   /*********************************START EBOOK******************************************** */
  db.ebookList = require("../model/ebook/ebook.model")(sequelize, DataTypes, Model);
  db.ebookImage = require("../model/ebook/ebookImage.model")(sequelize, DataTypes, Model);
  db.ebookPurchase = require("../model/ebook/ebookPurchase.model")(sequelize, DataTypes, Model);
  db.ebookPurchaseSummery = require("../model/ebook/view_ebook_purchase.model")(sequelize, DataTypes, Model);
  db.ebookCategories = require("../model/ebook/ebookCategories.model")(sequelize, DataTypes, Model);
  db.view_ebook_list = require("../model/ebook/view_ebook_list.model")(sequelize, DataTypes, Model);
     /*********************************END EBOOK******************************************** */
    db.whatsapp_setting = require("../model/setting/whatsappSetting.model")(sequelize, DataTypes, Model);
    
   /*********************************START Rating******************************************** */
    db.rating = require("../model/rating/rating.model")(sequelize, DataTypes, Model);
    db.ratingView = require("../model/rating/view_rating.model")(sequelize, DataTypes, Model);
   /*********************************End Rating******************************************** */
   
   db.view_royality = require("../model/report/view_royality.model")(sequelize, DataTypes, Model);
   
 /*********************************START *affiliate_link ******************************************* */
  db.affiliateLink = require("../model/affiliate_link/affiliate_link.model")(sequelize, DataTypes, Model);
  db.affiliateLinkCategories = require("../model/affiliate_link/affiliate_linkCategories.model")(sequelize, DataTypes, Model);
  db.affiliate_user_track= require("../model/affiliate_link/affiliate_user_track.model")(sequelize, DataTypes, Model);
  db.view_affiliate_user_track_report= require("../model/affiliate_link/view_affiliate_user_track_report.model")(sequelize, DataTypes, Model);
  
  db.affiliateInvoiceUpload = require("../model/affiliate_link/affiliate_invoice_upload.model")(sequelize, DataTypes, Model);
  db.viewAffiliateInvoiceUpload = require("../model/affiliate_link/view_invoice_upload.model")(sequelize, DataTypes, Model);
  db.view_affiliate_link= require("../model/affiliate_link/view_affiliate_link.model")(sequelize, DataTypes, Model);
 /*********************************END *affiliate_link ******************************************* */
  
   /*********************************START *User Log activity ******************************************* */
  db.contactActivityLog = require("../model/user_activity_track/contact_activity_log.model")(sequelize, DataTypes, Model);
  db.logNotificationContent = require("../model/user_activity_track/todays_notification_content.model")(sequelize, DataTypes, Model);
  /*********************************END User Log activity ******************************************* */
  
    db.phonepeTransaction = require("../model/phonepe/phonepe_transaction.model")(sequelize, DataTypes, Model);
    db.phonepeCallback = require("../model/phonepe/phonepe_callback.model")(sequelize, DataTypes, Model);
    
    db.userLog = require("../model/user/log_user_details.model")(sequelize, DataTypes, Model);
    
    
    db.holdIncome = require("../model/referral/HoldReferralIncome.model")(sequelize, DataTypes, Model);
    
    db.viewHoldIncome = require("../model/report/view_hold_referral_income.model")(sequelize,DataTypes,Model);
    db.royality_task = require("../model/log/royality_task.model")(sequelize,DataTypes,Model);
    
    
  /*********************************START CCAVENUE******************************************** */
  db.ccAvenueRequest = require("../model/bill_pay/ccavenue_request.model")(sequelize, DataTypes, Model);
  db.ccAvenueResponse = require("../model/bill_pay/ccavenue_response.model")(sequelize, DataTypes, Model);

  /*********************************ENDS CCAVENUE******************************************** */
  
    
  /*********************************START BILLDESK******************************************** */
  db.billdeskRequest = require("../model/billdesk/billdesk_request.model")(sequelize, DataTypes, Model);

  /*********************************ENDS BILLDESK******************************************** */
  
  /*********************************START Courses Video******************************************** */
  db.videoCategories = require("../model/course_video/videoCategories.model")(sequelize, DataTypes, Model);
  db.videoCourseDetails = require("../model/course_video/videoCourseDetails.model")(sequelize, DataTypes, Model);
  db.viewCourseVideo = require("../model/course_video/view_courseVideo.model")(sequelize, DataTypes, Model);
  /*********************************END Courses Video******************************************** */
  
  db.userIdCard = require("../model/user/user_id_card.model")(sequelize, DataTypes, Model);
  db.viewIdCard = require("../model/report/view_idcard_details.model")(sequelize, DataTypes, Model);
  
  
  db.employeeRole = require("../model/employee/role.model")(sequelize, DataTypes, Model);
  db.employee = require("../model/employee/employee.model")(sequelize, DataTypes, Model);
  db.viewEmployee = require("../model/employee/view_employee.model")(sequelize, DataTypes, Model);
  
  db.menuMaster = require("../model/setting/menu.model")(sequelize, DataTypes, Model);
  db.menuPermission = require("../model/setting/menu_permission.model")(sequelize, DataTypes, Model);
  db.viewMenuPermission = require("../model/setting/view_menu_permission.model")(sequelize, DataTypes, Model);
  
  //Campaigns
  db.campagins = require("../model/affiliate_link/campagins.model")(sequelize, DataTypes, Model);
  
  
  db.checkoutLog = require("../model/add_money/checkout_log.model")(sequelize, DataTypes, Model);
  db.messagingService = require("../model/notification/messaging_service.model")(sequelize, DataTypes, Model);
  
  
  db.SchemeLevel = require("../model/referral/SchemeLevel.model")(sequelize, DataTypes, Model);
  db.viewPrimeProduct = require("../model/report/view_prime_product.model")(sequelize, DataTypes, Model);
  
  db.userDataNotification = require("../model/log/user_data_notification.model")(sequelize, DataTypes, Model);
  
  /**********************************************START***PACKAGE************************************************************/
  
  
   db.Package = require("../model/package/Package.model")(sequelize, DataTypes, Model);
   db.Product = require("../model/product/Product.model")(sequelize, DataTypes, Model);
   db.ProductImages = require("../model/product/ProductImages.model")(sequelize, DataTypes, Model);
   
   db.OrderHistory = require("../model/orderhistory/orderhistory.model")(sequelize, DataTypes, Model);

   
   db.CustomerCart = require("../model/customer_cart/customer_cart.model")(sequelize, DataTypes, Model);

   db.CustomerAddress = require("../model/customer_address/customer_address.model")(sequelize, DataTypes, Model);
   
   db.PackagePurchase = require("../model/package/PackagePurchase.model")(sequelize, DataTypes, Model);
   db.PackagePurchaseDetails = require("../model/package/PackagePurchaseDetails.model")(sequelize, DataTypes, Model);
   db.ViewPackagePurchase = require("../model/package/viewPackagePurchase.model.js")(sequelize, DataTypes, Model);
  
  /*************************************************END PACKAGE**************************************************************/
  
  /*************************************************Start Loan**************************************************************/
  
   db.LoanRequest = require("../model/loan/loan.model")(sequelize, DataTypes, Model);
   
   /*************************************************END Loan**************************************************************/
   db.Cart = require("../model/cart/cart.model")(sequelize, DataTypes, Model);

   db.ReferralIncomesss = require("../model/referral/ReferralIncomesss.model")(sequelize, DataTypes, Model);
   db.Slab = require("../model/slab/slab_model.js")(sequelize, DataTypes,Model);
   db.UserSlabStatus = require("../model/slab/user_slab_mode.js")(sequelize, DataTypes,Model);
   db.marketing_content = require("../model/marketing_content/marketing_model.js")(sequelize, DataTypes, Model);
   db.PrimeUserRequest = require("../model/prime/primerequest.model.js")(sequelize, DataTypes, Model);


  return db;
}


module.exports = {
    connect,
    config,
    timeZone,
    baseurl
}