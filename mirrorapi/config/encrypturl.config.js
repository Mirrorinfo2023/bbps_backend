
const routerUrl = () => {
   
    const obj = {};
    //users.js
    obj.login=  '/2736fab291f04e69b62d490c3c09361f5b82461a'
    obj.admin_login= '/4e22b047986b40e5018b04a71c7df2e04893f2d3'
    obj.register= '/13a2828b3adecc1c32ea3888d08afa51e147b3f3'
    obj.refferBy= '/9a82bc2234a56504434ce88e3ab2a11f34b0dcc8'
    obj.getUserDetails='/8f3457ae01ceba087cf9790ab03e62a6035bd460'
    obj.resetPassword='/d1a207b38c8b705457e740a084bcf96d959ea01e'
    obj.getMpin= '/f0a52c7bd4f59cc75f2be2ead939ffa1adda3441'
    obj.uploadKyc='/550ecdddb5b8b023dda91594810884c12456d0a3'
    obj.getKyc= '/b8e015dd1c79a227c4cb1ceefaf8e3ab2a79665f'
    obj.getKycReport= '/421abbe46f1f142bd142def0e11ad9f7433adad6'
    obj.updateKycStatus='/c554430d8f155abbaa1ee9c2dbaf8adb95c8132f'
    obj.updateUserStatus= '/7e0f025e644befa1fce101beb075a6acc6360b16'
    obj.getProfile= '/63c6ad33e3395d611c35ed9ef749fd8fe4ae2bb4'
    obj.updateUserProfile= '/978d91c8d62d882a00631e74fa6c6863616ebc13'
    obj.updateProfileUserinfo= '/7b02c64a0be08761645414bcc7fdbc8e583fbce3'
    obj.getProfileUserinfo= '/68ddfd064d1bf11ab6689399a70908c993fd11b9'
    obj.resetMpin='/73c0a707a700129fd2b4f7cb4b982d3a549904b1'
    obj.getUserOldIncome='/ec6019ea7e315629cee41fc1ec0fa87d90827d35'
    obj.checkOldincomeExists='/f3fe0b8f30dd498bce7cabe83acc00722db55006'
    obj.creditDebitIncomeToUser='/d7dfaf86f2ab8c7013f268736ab747e07bd8558e'
    obj.adminResetPassword='/1c3bb4525d626c9fabed22789ba34ec12e097222'
    obj.updateUserInfoAdmin= '/663afe0b50d03001ceafa9c3634cf0f91235d041'
    obj.checkMobileOrEmailAdmin='/582c2220d0291f82c235404e6e399821ed67c43f'
    obj.updateKyc='/94ca940072d5ffe21b2b9d922e08617399be3d1f'
    obj.getQrcode='/e2eea9ffa100bbd9b7e3ef2b0bafb8f59920cea8'
    obj.unblockUser='/77651f481820ee7a6d33dfde4579d48715f0d1d9'
    obj.goToShop= '/262206799e879277961403f83d477c5e70da8dfc'

    //user_intrest.js
    obj.getUserIntrestCategory='/1ce6d7a711f368ac533706d422de525251c1cbd1'
    obj.addUserIntrest='/65bc1ac61a1b3bb3169cd4162e417261515b8500'

    // wallet.js
    obj.getWalletBalance='/e1af0d84d643e7c955bee1ee6d03a8b9a88a07fd'
    obj.getUpi='/bef0c0a17a8e08250ed3f01d12a3d90a5513685f'
    obj.creditDebitIncomeToUser='/d7dfaf86f2ab8c7013f268736ab747e07bd8558e'
    obj.getBalanceTest='/3d0426cb4eecf64d963966f6da3852804c20a951'

    //whatsapp.js
    obj.sendWhatsapp= '/d3c2d996e20867ebecb5b7d00f5af8f58d6bc93f'

    // user_activity.js
    obj.adduserContactLog= '/e234b3d608b29624376a57c611be205d190a03fe'
    obj.getTodayNotificationContent= '/a2dd37876fb4f77b42cc0f987292f06735f61d47'

    //state.js
    obj.getState= '/d23d7537f9a6da6fd195810c82699cb2f81c3d11'

    //spinner.js
    obj.getSpin='/878bd8db91d37f08f7832eb1ac257c5630d02a0c'
    obj.getCashbackUsers='/e3684976683a3095455bb2635a5f771e88ed865a'
    obj.getSpinnerCashback= '/4df54ead729413b48907e5c340ffb34a41f31438'

    //shopping.shiprocket.js
    obj.updateWalletAmount= '/36eaedd6dc5293e46b59c318ae1a47a1df0fda44'
               
    //settings.js
    obj.getSetting='/1bca5b9ab9cca837253421bedec76bd707fe86b8'
    obj.rechargePanel= '/99e48a8bd59105af693f6970bba7b39190d0136b'
    obj.getPanel= '/20e0f44a1debb6980d7cb8e03ad1348499dfd28d'
    obj.getWhatsappSetting='/7a31d17452d0bf82cb568e314db67e48feb5338f'
    obj.getWhatsappDetails='/9e5cf0667ab8e9293afbfce50e0231222fb36121'

    //send_money.js
    obj.sendMoney='/9d9a5bf0e229c2340d44805887783031a827d011'
    obj.sendMoneyHistroy='/f5567273ef3f87304e5836a8d3cd1bfc0df63f00'

    //reports-otp.js
    obj.otp= '7a20aecd2cb38bc00e301d11d10224588104c366'

    //reports-passbook.js
    obj.getPassbook='/f1d27ae35a092cf166f67073a450fd6d759430e8'
    obj.getCashbackPassbook='/3289bc508f971f36c114d93c2bb11979117be3c5'
    obj.getPrimePassbook='/1da0647f209c89e214485f6cedfc94975fcbdfda'
    obj.getIncomePassbook= '/dbafcc3a978c44e1e6255bfda23d108c5463cf16'
 
    //report- refferral.js
    obj.primeUserReport='/970213a38c9fb83baa350755d2e83f79f1e20f5f'
    obj.primeDistributionReport= '/d64cbc0df7a77cb6bc035f5f615857719a98f2ad'
    obj.userIncomeReport= '/407cdc812367385716bc5148740ab3889cd4ee39'
    obj.teamDetails='/2f01312cafbd54f54f71b56d3d03cbae1fc8cdf7'
    obj.teamLevelDetails='/65e1bce665c5b66ff4076e963488b62999b44c16'
    obj.companyPortfolio='/92ba6b72c22a4434a2c259c84a956435fa6fb21a'
    obj.targetRoyalityGraph='/f8d25582c395b3ec9ea97b352f77331b4d3dcb91'
    obj.totalRankDistribution='/a0fa5da342840d6465d3bc39baae7ad9d2efbd91'

    // report- report.js
    obj.userSummary='/fb3898964f85e3cd9680f6f23606c2fceffad842'
    obj.userDetails= '/70b12e5fc4d4c51474b2b32706b248af89fce3d4'
    obj.rechargeReport= '/a3a0f64509f03bd79100fe156229a1bd0224a081'
    obj.getRedeemReport='/fc65092846f39a738cff7c2b2f630ac01e981980'
    obj.getRedeemHistory='/3b81e6c552b7037a455fc4a9f77e6c627ec5de11'
    obj.cashbackReport='/5c8aac211aa3976a71d11bde4ba97866d32a647e'
    obj.primeWalletReport='/4918fe22e9d122dc02638b33b7be5563b45f0e0f'
    obj.billPaymentReport='/6987032b12ec453b6541d5c8f12e42d5960507b2'
    obj.royalityIncomeReport='/4f078c9a45aa5b1cff4c2ccd2b3030bb8c2ee9c3'
    obj.rechargeHoldReport='/ecc93a47a513d654940001ee988b417914509670'
       
    // report- userSummery.js
    obj.userSummary1='/fb3898964f85e3cd9680f6f23606c2fceffad842'

    //refferral.js
    obj.getReferralPlan='/c128bf13f4959e995c9c74ecf1aef8cb5c665423'
    obj.purchase='/d376ca2995b3d140552f1bf6bc31c2eda6c9cfc8'
    obj.requestRedeem='/1b11b22949aff1244922265015f806637a523f04'
    obj.approveRedeem='/ad2a9ab913b510abebf379e2d2edca4ff3cc18af'
    obj.rejectRedeem='/b7a11d471434710e1618a20cf87eabb161fa18f5'
    obj.bulkRoyalityIncome='/32898e5fc9b7758fc17582339c16ff9bee074e4d'

    // Recharge - Recharge.js
    obj.rechargeCashbackEligibility= '/805880501bb5826b5b9306ff0c8518fe26f30560'
    obj.makePayment='/6dedab379214aed7d90729f2f290bccd37e88ab2'
    obj.rechargeHistroy='/ebf2afb945bb7d02dd95ef376e7cd9b7142345fd'
    obj.panelTest='/7442f092f20d00d79fdb4efaa85d2172962ec4ba'
    obj.rechargeHoldApproved='/fdfbf5dddb53c5f525bf8b07a57855b37a001b1f'
    obj.rechargeReject='/b41896dc264935ca7e6c7b973142fdffa826cd9a'

     // Recharge - ServiceDiscount.js
     obj.addDiscount='/027bfc4af2a5f930499e0e05ab8e0a5b018bf81c'
     obj.getDiscount='/5f7c6a3ea38c126af8aff474e7ffeaf473bae80e'

    
     // Recharge - ServiceOperator.js
     obj.addOperatorCode='/206bf813581c3c892033755934d4211bcfc3533b'
     obj.getOperatorCode='/ef9eb3dfc13388a082a9cce653f11cbacc111cd9'

    // Recharge - Service.js
    obj.addService='/f9037c7814e6a783390ebf7487dd7cdad1380efb'
    obj.getService='/81511bc93cd6be112f5fb92495e3c776a419d302'

    // Rating.js
    obj.addRating='/7faeaa2d35abf1c4f3d8b09b66887a7f2bb57df1'
    obj.getRating='/b417f7430a544d2cc3ae1ad4ed67f9e6f51453aa'
  
    // plan.js
    obj.getPlan='/ae92b245c360cdc9c1e6aba93d0f1fb4b1bbe1cc'
    obj.getOfferPlan= '/b8ff50760f4096f61c509fd28c503063060156e2'
    obj.getMobileOperator='/922833daa96b124c3d9de9ba182ce9a69be0f11e'
  
    //pincode.js
    obj.getPincode='/916e4eb592f2058c43a3face75b0f9d49ef2bd17'

    //page.js
    obj.getPage='/b22516f0a4f88a3a79027dec614ba2dfc442c9c5'
    obj.getPagesAdmin='/60ecd0ba1b16c34dc7a3cd0c761c59d44e53e55d'
    obj.getPageDetails='/bd67f188ee4c2fb79955e5fbf75018143ae01929'
    obj.updatePage='/7d94231e94c1036e65cccdeac60878e5430e9cd9'

    //otp.js
    obj.getOtp='/8930cae4a942a0286226f1651dfbff89216174c8'
    obj.verifyOtp= '/3ae2750febeb3583bec28c67c42063120cb72963'
    obj.sendBbpsMessage='/06433f7a7a168ceb43d9d18cc39424bd4f006143'

    //operator.js
    obj.addOperator='/428fd54ea9e40f7c816b6ffc2887e35015ee539e'
    obj.getOperator='/8a6bb5e0bc0e95eec947e2327b2278d137373901'
    obj.getMobileOperator='/922833daa96b124c3d9de9ba182ce9a69be0f11e'

    //notification.js
    obj.addNotification='/a10541257fe7fa6bd3f2e0422b287a0304cab4b4'
    obj.getNotification='/5dfe9b4e98a6db4b15d381d44d2ebaa1b965a70f'
    obj.getNotificationCategory='/a29aa177fc78c32cf15df22d81d0d7d7a0496487'
    obj.getAppType='/3c25fb65f1dc491cc8b5ec9d833fa38ed8b93725'
    obj.registerFcmToken='/1805329ff272b1a833a0527a4328c6db0c386a81'
    obj.getFcmNotification='/a34637968c76992fdbb2911b6025e15e2aad555d'


    // meeting.js
    obj.addMeeting='/5cf462f2376d2a717f10a3eb66bf6294d01825b9'
    obj.getMeetingList='/6a6b430a42c06b39a979950519f8d6732aeba6ea'
    obj.getMeeting='/42e8346e210d48ec003fc542756243cb1f032a5f'
    obj.updateUserwiseMeetingDetails='/e6e2c7ed01d29c4186419bbb869fcd5756e5d18b'
    obj.meetingUserEnrollmentDetails='/3bacf58678791b87d5e04e8b23d36b55107c2e08'
    
    //log.js
     obj.recentAppUse='/be73328de90054a298492739452104ae92c2259d'
     obj.userActionLog='/ac9e00dee34fc7aa3a4a3c1fce59687d6692c03b'

    //leads- categories.js
    obj.addCategory= '/e8c972c374e0499787cf9a6674ee95ba94e2731f'
    obj.getCategory= '/006db6cc97a5160392932874bf6539ad2f0caea4'
    obj.getChildCategory= '/b68e6676a2eacb73d64c914f3281d8d05d9abdb0'
    obj.getLeadCategory= '/55f2b36ffe7142259776f916868b2911d08b3594'
    obj.updateStatusCategory=  '/081c13d3d222eff121b42d31a246e368acdf5c4a'
    obj.updateLeadCategory= '/fa9b4fe13fd9fff1aed0fc77d4e4a9c211eab1d5'

     // Lead lead.js
     obj.addLeads= '/10a78732662e6299231a65fe6be9e08bc537ecf1'
     obj.getLeads= '/2d15307da7beab814cc1ef3876d808ee8178bfe7'
     obj.addLeadsDetails= '/15640d0727b942369e83c198e10ca042b76d4b2c'
     obj.getLeadsDetails= '/6d63c61c58f679360daf5e77e24ae74bd3276ba8'
     obj.getLeadsReport= '/c3af2ca27c1a9974f0992979b447bdba908be445'
     obj.getLeadsDetailsReport= '/15f2b6f56c3b0cea91ead9b830b6082ffc6e911f'
     obj.trackLeadUser= '/f51f84519e9404300f57176405f976e04fcc6dc8'
     obj.getTrackLeadUserReport= '/1582360c573208f5a3fa685729b391b6eb83be8e'
     obj.updateLeadStatus= '/5347b404e605b74879630f9d7f8e6dc58e1b6b7b'
     obj.getLeadAdmin=  '/1debc1a3b74175746b59efe26c5149a71356c6f0'
     obj.updateStatus= '/c47742a47f95494d4ae9f39171b1900745c703df'
     obj.updateLead= '/70e32f5e2d2e48b2a4e2706e5860eb214ae59f65'

       //insurance.js
    obj.addInsurance='/c98268880c126e5b95e864dd6f1db2411f30cd68'
    obj.updateInsurance='/7606f026cb85c94187709c98a0ae7bee1ff93979'
    obj.getPolicy='/a6581aee75978c8990e6e8a907b4b0efa1d614df'
    obj.getInsuranceUserDetails='/8977cca5e71a7ff213b236b224651c8efacca02f'
    obj.getInsuranceUserTrackReport='/b02ca79619f3ec5a9c815290aaecd49da3b72586'

    //graphics.js
    obj.getGraphicsCategory='/ee2bbc96d1e8aa95ad3d86b4ef019e944b991769'
    obj.addGraphics= '/b4dd76767d52fb0801c6596522188c17ee7ddbcf'
    obj.getGraphics='/e20dd3d5e2dbb23620d2f72a2d5d22b0c58ce9d4'
    obj.getGraphicsCategorywise='/5b1e268857b9ac47d787bfc320cbca2b9fd156fc'
    obj.updateLikeShareCount= '/3e37cbc0fbbc941624e6bfc3f2ffd966bf679dd4'
    obj.getGraphicsReport='/efa221ee4312afa5e470066d80b2bcd8dc2a5266'
    obj.getCategoryList= '/c4c98391befddfd3fbe29ca55b446e4763951b0a'
    obj.addCategoryGraphics='/e8c972c374e0499787cf9a6674ee95ba94e2731f'
    obj.updateGraphicsCategoryStatus='/b280cf484ac215eb3fda64af255d9117b190404d'
    obj.getCategory='/006db6cc97a5160392932874bf6539ad2f0caea4'
    obj.updateGraphicsCategory='/ec15edf51a1e70ed107720da25d0e31e6fb56190'
    obj.updateGraphicsStatus='/78275d02a0df1a2ca9d6b677676903df74f0072d'
    obj.getGraphicsCategoryAdmin='/fcda3a4b836052cfed69acd8d14ac3b4bce64d15'


      //feedback.js
      obj.getFeedbackCategory='/ed77dffbfc0792816d0a00f05b0d47bcabe65b66'
      obj.getFeedbackReason='/063938be72c470c5758523bc343e1db1d01da302'
      obj.addFeedback= '/7bfe376e3188d3d98cb093fc5a55531d8c59eb65'
      obj.getFeedbackReport='/267156fd48d2ae207275d1c29cc7c92d1e22f38d'
      obj.updateFeedback='/5e018aeed4fdad6f2cb1ee03803c18bdda198995'
      obj.getQuestionAnswerList= '/e52e67ddfffe8f538855f8cacfee372b176fb5f5'
      obj.addFaq= '/c35307e98af31565e3846e9bc8a9a9453808ee74'
      obj.getFaqReport= '/169458f2f6c3eaf358923e88f95d4d8a33c712ca'

   
       // Ebook - ebbok.js
      obj.getEbookList= '/ed17795bf5e9af85a4885476188473ba56a71ad6'
      obj.getEbookDetails= '/74b90ced3b6c9e2621349daf5149dd063ff973b8'
      obj.ebookDashboard= '/9f96cd095811578066e6b1382bfb0a82b5f861af'
      obj.buyEbook= '/6642bab65d405b900d2003c7ca6303315230ad39'
      obj.getPurchaseHistory=  '/a10209b657be958d67b0e66d31c294ac0c36e86d'
      obj.getEbookInvoice= '/ba95c5a32382137eb201b1a2c61fd74590d55b40'
      obj.ebookList= '/ed914e1b6358d452cd0baad795097c6bf1ccc084'
      obj.updateEbookStatus= '/4e91b59616cb27978fed838684dd14f79dc14df5'
      obj.getEbookData= '/12f40908f9f9e83d1dedc80b91ae70b780f46e90'
      obj.addEbook= '/943c51160bc0dcef12b798eb0eb9ad89aa31027b'
      obj.updateEbook= '/a925b61fbc8fb450354deb8500e8a8fe530cb66a'

    // Ebook - categories.js
    obj.getCategoryEbook='/006db6cc97a5160392932874bf6539ad2f0caea4'
    obj.addCategoryEbook='/e8c972c374e0499787cf9a6674ee95ba94e2731f'
    obj.updateStatusEbook='/c47742a47f95494d4ae9f39171b1900745c703df'
    obj.getCategoryDataEbook='/8b2ff2806f93320c67953d8562cab1c947c263d9'
    obj.updateCategoryEbook='/b2d693d17afe90dc9f365b4fb12dce684c54a908'

     // countries.js
    obj.getCountries= '/8f8b98d6e5b01b9822050ede3c5d3ef017cf9d8d'
   
     //city.js
     obj.getCitys='/e2caa4a86f1cda61fa7efc12c7a8791a8c59bc90'

    //ccavenue.js
    obj.paymentCcavenue= '/e86256b2787ee7ff0c33d0d4c6159cd922227b79'
    obj.paymentResponseCcavenue=  '/67fdcae6c0d5714bd23a983962aa834b782f9f6f'
  
     //billpay.js
     obj.billerInfo= '/454a048ee09f82be251a44b976fadb1bf3f3a4e6'
     obj.billFetch= '/f308eae69c85a45d634afbcc76a5d94609b832dd'
     obj.billPay= '/44672b279d2d2f4cf1a9ea3fae4029bfd1674e39'
     obj.bulkFetch= '/06c8b786438b945e65c4315fd78e7cf347a62212'
     obj.billPayQuick= '/f570e94788c88dc689374a4d3d6ee5db74442b1a'
     obj.getPaymentOption= '/55e3f98d27579774b66738a6eb56a56e679d6173'
     obj.billdeskRequest='/f68534f063ce1c646c6f583277c58cdbf28aa878'
 
       //bannner.js
    obj.getBanner= '/338876c40d469f2abe060d986593e12dfc9aa48c'
    obj.getBannerReport= '/b0922bbeca57785f0add2136bca4786594e739cd'
    obj.updateBannerStatus= '/ddeb0530275df10eb908150c0c14f0a7c10dd586'
    obj.getBannerCategory= '/66a815be731fee133d7ecc8f240447c14e770b83'
    obj.addNewBanner= '/848c9e6b17fd0bab24254d057a09a88e8db32bcc'

    //affiliate_link.js
    obj.getAffiliateCategory=  '/6e4ec75bfe256470804819074a120e9ccfd6cb7e'
    obj.getAffiliateLinks= '/bd00204ea14e557e454c51823dedd2c0a4da579a'
    obj.addAffiliateLink= '/ab9988b0751d26b32b574cd050f5cb7cf6311c5a'
    obj.getAffiliateLinksAll= '/0c67d4a4f349531562df9f4aafddd24a811db6db'
    obj.getAffiliateLinksAdmin= '/e72c90df7056e7008a36a0287ebbfb51cf9731d2'
    obj.updateAffiliateLinkStatus= '/b9e0cc3cfc57cfbf38164df0b8fc16a72a77e5c2'
    obj.getLink= '/b54a06dd1eeca4958790e76736f887a40183b7d5'
    obj.updateAffiliateLink=  '/91d1c5b20e70088cd3e1d1c3ea02ca68f817454b'
    obj.getAffiliateUserDetails=  '/72c881d7c9725765e2a37351e77500fd1649ea2f'
    obj.getAffiliateUserTrackReport= '/d2eac550a02e6238e96e808cd4b9e0ff4ebe7ddc'
    obj.updateAffiliateTrackStatus= '/4a23a6ca7d17731af792568c65f0cbb6a1e6661a'
    obj.affiliateOrderHistory='/b181d284f6057c53a8e95155befb0e6e4b81decd'

    // address.js
    obj.getAddress= '/51904cbe0e71b248e4eabfac4f6c11fe96e2aeac'

    //add Money Request.js
    obj.addMoneyRequest= '/53aeb245864f03638400271b8a13ac38bad62be5'
    obj.addMoneyOrder='/73697b4574fc8005d16a942782a86562b6760252'
    obj.addMoneyList='/2ffbd5ac811ff7360bd1599ac7eaf56b689da024'
    obj.updateAddMoney='/5242f89dd23b3e850a2e8eb1d935b80206bff9e0'
    obj.addMoneyHistroy='/098263ebb9bde3adcfc7761f4072b46c9fc7e9eb'
  

    return obj;

}

module.exports = {
    routerUrl
}