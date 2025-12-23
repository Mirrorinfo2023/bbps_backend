const iciciModule = require('../config/icicibank.config');
const axios = require('axios');
const crypto = require('crypto');
const utility = require('../utility/utility');

const iciciConfig = iciciModule.iciciBank();

/**
 * Generate Secure Hash for ICICI PG
 */
function generateSecureHash(payload) {
    const hashText =
        payload.addlParam1 +
        payload.addlParam2 +
        payload.aggregatorID +
        payload.amount +
        payload.currencyCode +
        payload.customerEmailID +
        payload.customerMobileNo +
        payload.customerName +
        payload.merchantId +
        payload.merchantTxnNo +
        payload.payType +
        payload.returnURL +
        payload.transactionType +
        payload.txnDate;

    return crypto
        .createHash('sha256')
        .update(hashText + iciciConfig.secretKey)
        .digest('hex');
}

/**
 * Initiate ICICI Bank Payment
 */
function IciciInitiateSale(amount, redirect_url, customer) {
    return new Promise(async (resolve, reject) => {
        try {
            const merchantTxnNo = utility.generateRequestId();
            const txnDate = utility.getCurrentDateTime(); // yyyyMMddHHmmss

            const payload = {
                merchantId: iciciConfig.merchantId,
                aggregatorID: iciciConfig.aggregatorId,
                merchantTxnNo: merchantTxnNo,
                amount: amount,
                currencyCode: iciciConfig.currencyCode,
                payType: iciciConfig.payType,
                customerEmailID: customer.email,
                transactionType: iciciConfig.transactionType,
                returnURL: redirect_url,
                txnDate: txnDate,
                customerMobileNo: customer.mobile,
                customerName: customer.name,
                addlParam1: "000",
                addlParam2: "111"
            };

            payload.secureHash = generateSecureHash(payload);

            const response = await axios.post(
                iciciConfig.initiateSaleUrl,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const result = response.data;

            resolve({
                result: result,
                request: payload,
                redirectUrl:
                    result.redirectURI && result.tranCtx
                        ? `${result.redirectURI}?tranCtx=${result.tranCtx}`
                        : null
            });

        } catch (error) {
            reject({
                error: error.response ? error.response.data : error.message
            });
        }
    });
}

/**
 * ICICI Transaction Status Check
 */
function IciciTransactionStatus(merchantTxnNo) {
    return new Promise(async (resolve, reject) => {
        try {
            const payload = {
                merchantId: iciciConfig.merchantId,
                merchantTxnNo: merchantTxnNo
            };

            const hashText =
                payload.merchantId +
                payload.merchantTxnNo;

            payload.secureHash = crypto
                .createHash('sha256')
                .update(hashText + iciciConfig.secretKey)
                .digest('hex');

            const response = await axios.post(
                iciciConfig.commandUrl,
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            resolve({
                result: response.data,
                request: payload
            });

        } catch (error) {
            reject({
                error: error.response ? error.response.data : error.message
            });
        }
    });
}

/**
 * Verify ICICI Response Hash (Return URL)
 */
function verifyIciciResponse(responseData) {
    const hashText =
        responseData.merchantId +
        responseData.merchantTxnNo +
        responseData.amount +
        responseData.responseCode;

    const calculatedHash = crypto
        .createHash('sha256')
        .update(hashText + iciciConfig.secretKey)
        .digest('hex');

    return calculatedHash === responseData.secureHash;
}

module.exports = {
    IciciInitiateSale,
    IciciTransactionStatus,
    verifyIciciResponse
};
