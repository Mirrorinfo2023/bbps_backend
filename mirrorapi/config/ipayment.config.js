const ipayment = () => {
    
    const obj = {};
    obj.clientId="ipayment_f8229dc8e146165a13480142555314028"; 
    obj.clientSecret="1baf255e1611cd262d6390ed70930fe813480142555324876";
    obj.url="https://console.ipayments.in"; 
    obj.rechargePlanUrl = `${obj.url}/v1/service/recharge/mobile/plan`;
    obj.rechargeUrl = `${obj.url}/v1/service/recharge/initiate`;

    // obj.bbpsclientId="ipayment_3aef8022ef08596e13987267772037505"; 
    // obj.bbpsclientSecret="5e3ab1dcd45ddbae3fea7d894245557613987267772054302";
    // obj.billFetchUrl = `${obj.url}/v1/service/bbps/fetch/bill`;
    // obj.billPaymentUrl = `${obj.url}/v1/service/bbps/bill/payment`;
    // obj.billerInfoUrl = `${obj.url}/v1/service/bbps/fetch/biller/fetchByBillerId`;
     
    return obj;

}

module.exports = {
    ipayment
}