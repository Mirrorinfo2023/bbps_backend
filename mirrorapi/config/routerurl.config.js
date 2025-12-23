
const routerUrl = () => {
   
    const obj = {};
      //users.js
    obj.login=  '/login'
    obj.admin_login= '/admin_login'
    obj.register=     '/register'
    obj.refferBy= '/reffer-by'
    obj.getUserDetails=  '/get-user-details'
    obj.resetPassword= '/reset-password'
    obj.getMpin= '/get-mpin'
    obj.uploadKyc='/upload-kyc'
    obj.getKyc=  '/get-kyc'
    obj.getKycReport= '/get-kyc-report'
    obj.updateKycStatus='/update-kyc-status'
    obj.updateUserStatus= '/update-user-status'
    obj.getProfile= '/get-profile'
    obj.updateUserProfile=  '/update-user-profile'
    obj.updateProfileUserinfo= '/update-profile-userinfo'
    obj.getProfileUserinfo=  '/get-profile-userinfo'
    obj.resetMpin= '/reset-mpin'
    obj.getUserOldIncome= '/get-user-old-income'
    obj.checkOldincomeExists='/check-old-income-exists'
    obj.creditDebitIncomeToUser=  '/credit-debit-income-to-user'
    obj.adminResetPassword= '/admin-reset-password'
    obj.updateUserInfoAdmin= '/update-user-info-admin'
    obj.checkMobileOrEmailAdmin='/check-mobileOrEmail-admin'
    obj.updateKyc='/update-kyc'
    obj.getQrcode='/get-qrcode'
    obj.unblockUser='/unblock-user'
    obj.goToShop=  '/go-to-shop'

    //user_intrest.js
    obj.getUserIntrestCategory='/get-user-intrest-category'
    obj.addUserIntrest='/add-user-intrest'

    // wallet.js
    obj.getWalletBalance= '/get-wallet-balance'
    obj.getUpi= '/get-upi'
    obj.creditDebitIncomeToUser= '/credit-debit-income-to-user'
    obj.getBalanceTest= '/get-balance-test'

       //whatsapp.js
    obj.sendWhatsapp='/send-whatsapp'

    // user_activity.js
    obj.adduserContactLog= '/add-user-contact-log'
    obj.getTodayNotificationContent= '/get-today-notification-content'
    
    //state.js
    obj.getState= '/get-state'

    //spinner.js
    obj.getSpin='/get-spin'
    obj.getCashbackUsers='/get-cashback-users'
    obj.getSpinnerCashback='/get-spinner-cashback'

    //shopping.shiprocket.js
    obj.updateWalletAmount= '/update-wallet-amount'

    //settings.js
    obj.getSetting='/get-setting'
    obj.rechargePanel= '/recharge-panel'
    obj.getPanel='/get-panel'
    obj.getWhatsappSetting='/get-whatsapp-setting'
    obj.getWhatsappDetails='/get-whatsapp-details'

    //send_money.js
    obj.sendMoney='/send-money'
    obj.sendMoneyHistroy='/send-money-histroy'
    
    //reports-otp.js
    obj.otp='/otp'

    //reports-passbook.js
    obj.getPassbook='/get-passbook'
    obj.getCashbackPassbook='/get-cashback-passbook'
    obj.getPrimePassbook='/get-prime-passbook'
    obj.getIncomePassbook='/get-income-passbook'


    //report- refferral.js
    obj.primeUserReport='/prime-user-report'
    obj.primeDistributionReport='/prime-distribution-report'
    obj.userIncomeReport='/user-income-report'
    obj.teamDetails='/team-details'
    obj.teamLevelDetails='/team-level-details'
    obj.companyPortfolio='/company-portfolio'
    obj.targetRoyalityGraph='/target-royality-graph'
    obj.totalRankDistribution='/total-rank-distribution'


    // report- report.js
    obj.userSummary='/user-summary'
    obj.userDetails='/user-details'
    obj.rechargeReport='/recharge-report'
    obj.getRedeemReport='/get-redeem-report'
    obj.getRedeemHistory='/get-redeem-history'
    obj.cashbackReport='/cashback-report'
    obj.primeWalletReport='/prime-wallet-report'
    obj.billPaymentReport='/bill-payment-report'
    obj.royalityIncomeReport='/royality-income-report'
    obj.rechargeHoldReport='/recharge-hold-report'
   
    // report- userSummery.js
    obj.userSummary1='/user-summary'

    //refferral.js
    obj.getReferralPlan='/get-referral-plan'
    obj.purchase='/purchase'
    obj.requestRedeem='/request-redeem'
    obj.approveRedeem='/approve-redeem'
    obj.rejectRedeem='/reject-redeem'
    obj.bulkRoyalityIncome='/bulk-royality-income'


    // Recharge - Recharge.js
    obj.rechargeCashbackEligibility= '/recharge-cashback-eligibility'
    obj.makePayment='/make-payment'
    obj.rechargeHistroy='/recharge-histroy'
    obj.panelTest='/panel-test'
    obj.rechargeHoldApproved='/recharge-hold-approved'
    obj.rechargeReject='/recharge-reject'

    // Recharge - ServiceDiscount.js
    obj.addDiscount='/add-discount'
    obj.getDiscount='/get-discount'

     // Recharge - ServiceOperator.js
     obj.addOperatorCode='/add-operator-code'
     obj.getOperatorCode='/get-operator-code'

    // Recharge - Service.js
    obj.addService='/add-service'
    obj.getService='/get-service'
 
     // Rating.js
     obj.addRating='/add-rating'
     obj.getRating='/get-rating'

    // plan.js
    obj.getPlan='/get-plan'
    obj.getOfferPlan= '/get-offer-plan'
    obj.getMobileOperator='/get-mobile-operator'

    //pincode.js
    obj.getPincode='/get-pincode'

    //page.js
    obj.getPage='/get-page'
    obj.getPagesAdmin='/get-pages-admin'
    obj.getPageDetails='/get-page-details'
    obj.updatePage='/update-page'

    //otp.js
    obj.getOtp='/get-otp'
    obj.verifyOtp= '/verify-otp'
    obj.sendBbpsMessage='/send-bbps-message'

    //operator.js
    obj.addOperator='/add-operator'
    obj.getOperator='/get-operator'
    obj.getMobileOperator='/get-mobile-operator'

    //notification.js
    obj.addNotification='/add-notification'
    obj.getNotification='/get-notification'
    obj.getNotificationCategory='/get-notification-category'
    obj.getAppType='/get-app-type'
    obj.registerFcmToken='/register-fcm-token'
    obj.getFcmNotification='/get-fcm-notification'

    // meeting.js
    obj.addMeeting='/add-meeting'
    obj.getMeetingList='/get-meeting-list'
    obj.getMeeting='/get-meeting'
    obj.updateUserwiseMeetingDetails='/update-userwise-meeting-details'
    obj.meetingUserEnrollmentDetails='/meeting-user-enrollment-details'

      // log.js
      obj.recentAppUse='/recent-app-use'
      obj.userActionLog='/user-action-log'

    //leads- categories.js
    obj.addCategory= '/add-category'
    obj.getCategory= '/get-category'
    obj.getChildCategory= '/get-child-category'
    obj.getLeadCategory= '/get-lead-category'
    obj.updateStatusCategory=  '/update-status-category'
    obj.updateLeadCategory= '/update-lead-category'

    // Lead lead.js
    obj.addLeads= '/add-leads'
    obj.getLeads= '/get-leads'
    obj.addLeadsDetails= '/add-leads-details'
    obj.getLeadsDetails= '/get-leads-details'
    obj.getLeadsReport= '/get-leads-report'
    obj.getLeadsDetailsReport= '/get-leads-details-report'
    obj.trackLeadUser= '/track-lead-user'
    obj.getTrackLeadUserReport= '/get-track-lead-user-report'
    obj.updateLeadStatus= '/update-lead-status'
    obj.getLeadAdmin=  '/get-lead-admin'
    obj.updateStatus= '/update-status'
    obj.updateLead= '/update-lead'

    //insurance.js
    obj.addInsurance='/add-insurance'
    obj.updateInsurance='/update-insurance'
    obj.getPolicy='/get-policy'
    obj.getInsuranceUserDetails='/get-insurance-user-details'
    obj.getInsuranceUserTrackReport='/get-insurance-user-track-report'

    // graphics.js
    obj.getGraphicsCategory='/get-graphics-category'
    obj.addGraphics= '/add-graphics'
    obj.getGraphics='/get-graphics'
    obj.getGraphicsCategorywise='/get-graphics-categorywise'
    obj.updateLikeShareCount= '/update-like-share-count'
    obj.getGraphicsReport='/get-graphics-report'
    obj.getCategoryList= '/get-category-list'
    obj.addCategoryGraphics='/add-category'
    obj.updateGraphicsCategoryStatus='/update-graphics-category-status'
    obj.getCategory='/get-category'
    obj.updateGraphicsCategory='/update-graphics-category'
    obj.updateGraphicsStatus='/update-graphics-status'
    obj.getGraphicsCategoryAdmin='/get-graphicsCategoryAdmin'


    //feedback.js
    obj.getFeedbackCategory='/get-feedback-category'
    obj.getFeedbackReason='/get-feedback-reason'
    obj.addFeedback= '/add-feedback'
    obj.getFeedbackReport='/get-feedback-report'
    obj.updateFeedback='/update-feedback'
    obj.getQuestionAnswerList= '/get-question-answer-list'
    obj.addFaq= '/add-faq'
    obj.getFaqReport= '/get-faq-report'

    // Ebook - ebbok.js
    obj.getEbookList= '/get-ebook-list'
    obj.getEbookDetails= '/get-ebook-details'
    obj.ebookDashboard= '/ebook-dashboard'
    obj.buyEbook= '/buy-ebook'
    obj.getPurchaseHistory=  '/get-purchase-history'
    obj.getEbookInvoice= '/get-ebook-invoice'
    obj.ebookList= '/ebook-list'
    obj.updateEbookStatus= '/update-ebook-status'
    obj.getEbookData= '/get-ebook-data'
    obj.addEbook= '/add-ebook'
    obj.updateEbook= '/update-ebook'

     // Ebook - categories.js
     obj.getCategoryEbook='/get-category'
     obj.addCategoryEbook='/add-category'
     obj.updateStatusEbook='/update-status'
     obj.getCategoryDataEbook='/get-category-data'
     obj.updateCategoryEbook='/update-category'

    // countries.js
    obj.getCountries= '/get-countries'

    //city.js
    obj.getCitys='/get-citys'

    //ccavenue.js
    obj.paymentCcavenue= '/payment'
    obj.paymentResponseCcavenue=  '/payment-response'

    //billpay.js
    obj.billerInfo= '/biller-info'
    obj.billFetch= '/bill-fetch'
    obj.billPay= '/bill-pay'
    obj.bulkFetch= '/bulkFetch'
    obj.billPayQuick= '/bill-pay-quick'
    obj.getPaymentOption= '/get-payment-option'
    obj.billdeskRequest='/billdesk-request'

    //bannner.js
    obj.getBanner= '/get-banner'
    obj.getBannerReport= '/get-banner-report'
    obj.updateBannerStatus= '/update-banner-status'
    obj.getBannerCategory= '/get-banner-category'
    obj.addNewBanner= '/add-new-banner'

    //affiliate_link.js
    obj.getAffiliateCategory=  '/get-affiliate-category'
    obj.getAffiliateLinks= '/get-affiliate-links'
    obj.addAffiliateLink= '/add-affiliate-Link'
    obj.getAffiliateLinksAll= '/get-affiliate-links-all'
    obj.getAffiliateLinksAdmin= '/get-affiliate-links-Admin'
    obj.updateAffiliateLinkStatus= '/update-affiliate-link-status'
    obj.getLink= '/get-link'
    obj.updateAffiliateLink=  '/update-affiliate-link'
    obj.getAffiliateUserDetails=  '/get-affiliate-user-details'
    obj.getAffiliateUserTrackReport= '/get-affiliate-user-track-report'
    obj.updateAffiliateTrackStatus= '/update-affiliate-track-status'
    obj.affiliateOrderHistory='/affiliate-order-history'

    // address.js
    obj.getAddress= '/get-address'

    //add Money Request.js
    obj.addMoneyRequest= '/add-money-request'
    obj.addMoneyOrder='/add-money-order'
    obj.addMoneyList='/add-money-list'
    obj.updateAddMoney='/update-add-money'
    obj.addMoneyHistroy='/add-money-histroy'



    return obj;

}

module.exports = {
    routerUrl
}