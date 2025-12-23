const bbps = () => {
    
    const obj = {};
    
    obj.instituteId   = "CV23"; 
    obj.accesscode    = "AVMU35FC06MQ20LKOG"; 
    obj.workingkey    = "F4DC2056224A8B67176155645619DFF3"; 
    obj.billerInfoUrl = "https://api.billavenue.com/billpay/extMdmCntrl/mdmRequestNew/xml";
    obj.billFetchUrl  = "https://api.billavenue.com/billpay/extBillCntrl/billFetchRequest/xml";
    obj.billPayUrl    = "https://api.billavenue.com/billpay/extBillPayCntrl/billPayRequest/xml"; 
    obj.ver           = "1.0";
    
    // obj.instituteId   = "MT23"; 
    // obj.accesscode    = "AVOF61DH15PF22MOZQ"; 
    // obj.workingkey    = "DEA7B320EFA00C38475882DD87123277"; 
    // obj.billerInfoUrl = "https://stgapi.billavenue.com/billpay/extMdmCntrl/mdmRequestNew/xml";
    // obj.billFetchUrl  = "https://stgapi.billavenue.com/billpay/extBillCntrl/billFetchRequest/xml";
    // obj.billPayUrl    = "https://stgapi.billavenue.com/billpay/extBillPayCntrl/billPayRequest/xml"; 
    // obj.ver           = "1.0";
     
    return obj;

}

module.exports = {
    bbps
}