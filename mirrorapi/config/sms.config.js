const sms = () => {
    
    const obj = {};
    obj.username="GLOBAL2020"; 
    obj.password="Mallglobe@789"; 
    obj.senderid="GLAPVT"; 
    obj.messagetype="N"; 
    obj.sms_url="http://sms.vipswallet.com/WebserviceSMS.aspx"; 
    obj.company="From Mirror Global";
    obj.template_id = "1707165212080091586";
    
    // sms country credentials
    obj.ssenderid="MRRTEC"; 
     
    obj.scompany="From Mirrorinfo Tech Pvt Ltd";
    obj.auth_key = "zRbdsQYan5IbK1aTZwKE";
    obj.ssms_url=`https://restapi.smscountry.com/v0.1/Accounts/${obj.auth_key}/SMSes/`;
    obj.auth_token = "LKnuipxy4V20kc1DtqMv2NwkmhF6zXjKcxkeX6Kc";
    obj.notifyUrl = "https://secure.mirror.org.in/api/otp/smsnotify";
    
     
    return obj;

}


// const sms = () => {
//     const obj = {};
//     obj.username="JOBBERSHUB"; 
//     obj.password="Yash@#123"; 
//     obj.senderid="JBRSHB"; 
//     obj.messagetype="smsquicksend"; 
//     obj.sms_url="http://login4.spearuc.com/MOBILE_APPS_API/sms_api.php"; 
//     obj.company="From Mirror Global";
//     obj.template_id = "1707170564447649771";

//     return obj;

// }

module.exports = {
    sms
}