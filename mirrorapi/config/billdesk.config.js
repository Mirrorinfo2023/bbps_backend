const billdesk = () => {
    
    const obj = {};
    
    //UAT credential
    // obj.marchantId = "V2UATBDSK"; 
    // obj.secrateKey = "4tYLuOm3JHGafrcbHba7szuT9q0JdpXk"; 
    // obj.clientId   = "v2uatbdsk"; 
    // //obj.url        = "https://uat1.billdesk.com/u2/payments/ve1_2/orders/create";
    // obj.url        = "https://pguat.billdesk.io/payments/ve1_2/orders/create";
    
    // Production credential
    obj.marchantId = "MIRRORINV2"; 
    obj.secrateKey = "jPlgvVmZaOIHOadhZV3bt4n1RuoVLT1U"; 
    obj.clientId   = "mirrorinv2"; 
    obj.url        = "https://api.billdesk.com/payments/ve1_2/orders/create";

    return obj;

}

module.exports = {
    billdesk
}