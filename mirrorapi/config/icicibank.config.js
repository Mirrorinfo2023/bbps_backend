const iciciBank = () => {

    const obj = {};

    // ===============================
    // ICICI BANK PG - UAT Credentials
    // ===============================

    obj.merchantId = "100000000007164";
    obj.aggregatorId = "A100000000007164";
    obj.secretKey = "ae85111d-7cc7-4f75-b0dd-6ebd33f8a86f";

    obj.initiateSaleUrl = "https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale";
    obj.commandUrl = "https://pgpayuat.icicibank.com/tsp/pg/api/command";
    obj.settlementUrl = "https://pgpayuat.icicibank.com/tsp/pg/api/settlementDetails";
    obj.authRedirectUrl = "https://pgpayuat.icicibank.com/tsp/pg/api/v2/authRedirect";

    // Common static values
    obj.currencyCode = "356"; // INR
    obj.payType = "0";   // All payment modes
    obj.transactionType = "SALE";

    return obj;
};

module.exports = {
    iciciBank
};
