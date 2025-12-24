const iciciModule = require('../config/icicibank.config');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const utility = require('../utility/utility');

const iciciConfig = iciciModule.iciciBank();

/**
 * =====================================================
 * 🔐 ENV VALIDATION
 * =====================================================
 */
if (!process.env.BASE_URL) {
    throw new Error('BASE_URL not defined in environment variables');
}

/**
 * =====================================================
 * 🔁 ICICI RETURN URL
 * =====================================================
 */
const ICICI_RETURN_URL =
    `${process.env.BASE_URL}/api/bill_payment/icici-response`;

/**
 * =====================================================
 * 🔐 HTTPS AGENT (LOCAL + SERVER SAFE)
 * =====================================================
 */
let httpsAgent;

if (process.platform === 'linux') {
    httpsAgent = new https.Agent({
        ca: fs.readFileSync(
            '/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem'
        ),
        rejectUnauthorized: true
    });
} else {
    httpsAgent = new https.Agent({
        rejectUnauthorized: true
    });
}

/**
 * =====================================================
 * 🆔 MERCHANT TXN NO (MAX 20 CHARS)
 * =====================================================
 */
function generateMerchantTxnNo() {
    return (
        'TXN' +
        Date.now().toString().slice(-10) +
        Math.random().toString(36).substring(2, 7)
    ).substring(0, 20);
}

/**
 * =====================================================
 * 🔐 HMAC SHA256
 * =====================================================
 */
function generateHmacSHA256(message, secretKey) {
    return crypto
        .createHmac('sha256', secretKey)
        .update(message)
        .digest('hex');
}

/**
 * =====================================================
 * 🔐 INITIATE SALE HASH
 * =====================================================
 */
function generateInitiateSecureHash(payload) {
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

    return generateHmacSHA256(hashText, iciciConfig.secretKey);
}

/**
 * =====================================================
 * 🚀 INITIATE ICICI PAYMENT
 * =====================================================
 */
async function IciciInitiateSale(amount, customer) {
    try {
        const merchantTxnNo = generateMerchantTxnNo();
        const txnDate = utility.getCurrentDateTime();

        const payload = {
            merchantId: iciciConfig.merchantId,
            aggregatorID: iciciConfig.aggregatorId,
            merchantTxnNo,
            amount: Number(amount).toFixed(2),
            currencyCode: '356',
            payType: '0',
            customerEmailID: customer.email,
            transactionType: 'SALE',
            returnURL: ICICI_RETURN_URL,
            txnDate,
            customerMobileNo: customer.mobile,
            customerName: customer.name,
            addlParam1: '000',
            addlParam2: '111'
        };

        payload.secureHash = generateInitiateSecureHash(payload);

        const response = await axios.post(
            iciciConfig.initiateSaleUrl,
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
                httpsAgent,
                timeout: 15000,
                validateStatus: () => true
            }
        );

        const result = response.data || {};

        const redirectUrl =
            result.redirectURI && result.tranCtx
                ? `${result.redirectURI}?tranCtx=${result.tranCtx}`
                : null;

        return { request: payload, response: result, redirectUrl };
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            'ICICI initiate sale failed'
        );
    }
}

/**
 * =====================================================
 * 🔍 ICICI TRANSACTION STATUS
 * =====================================================
 */
async function IciciTransactionStatus(merchantTxnNo) {
    const payload = {
        merchantId: iciciConfig.merchantId,
        merchantTxnNo
    };

    payload.secureHash = generateHmacSHA256(
        payload.merchantId + payload.merchantTxnNo,
        iciciConfig.secretKey
    );

    const response = await axios.post(
        iciciConfig.commandUrl,
        payload,
        {
            headers: { 'Content-Type': 'application/json' },
            httpsAgent,
            timeout: 15000
        }
    );

    return { request: payload, result: response.data };
}

/**
 * =====================================================
 * 🔐 VERIFY ICICI RESPONSE HASH
 * =====================================================
 */
function verifyIciciResponse(body) {
    const hashText =
        body.merchantId +
        body.merchantTxnNo +
        body.txnID +
        body.paymentID +
        body.paymentDateTime +
        body.responseCode;

    return (
        generateHmacSHA256(hashText, iciciConfig.secretKey) ===
        body.secureHash
    );
}

module.exports = {
    IciciInitiateSale,
    IciciTransactionStatus,
    verifyIciciResponse
};
