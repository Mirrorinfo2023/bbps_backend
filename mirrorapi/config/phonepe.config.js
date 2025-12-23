

const phonepe = () => {
   
    const obj = {};
    obj.email= 'mirrorinfo2021@gmail.com'
    obj.password ='Mirror@#2020'
    obj.merchantId ='M22CW71WXNNO4'
    obj.api_key='042d53a9-b0da-4117-9f2b-665167c2b037'
    obj.key_index= '1'
    // obj.uat_pay_api_url= 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
    obj.prod_host_url= 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    // obj.check_txn_status= 'https://sit.paysprint.in/service-api/api/v1/service/pan/V2/txn_status'
    
    
    obj.paymentGatewayMerchantId='MIRRORINFOONLINE'
    obj.paymentGatewayApiKey='4413959d-b262-417e-bf57-af44266b20b3'
    obj.paymentGatewaycallbackUrl='https://secure.mirror.org.in/api/gateway/phonepy-gateway-callback'

    return obj;

}

module.exports = {
    phonepe
}