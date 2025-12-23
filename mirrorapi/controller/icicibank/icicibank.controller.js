const { connect, config } = require('../../config/db.config');
const { QueryTypes } = require('sequelize');
const utility = require('../../utility/utility');
const iciciUtility = require('../../utility/icicibank.utility');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

class IciciBank {

    db = {};

    constructor() {
        this.db = connect();
    }

    /**
     * ICICI Initiate Payment
     */
    async icici_request(req, res, ipAddress) {

        const decryptedObject = req;
        const { user_id, amount } = decryptedObject;
        const requiredKeys = Object.keys({ user_id, amount });

        if (!requiredKeys.every(
            key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined
        )) {
            return res.status(400).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 400,
                    message: 'Required input data is missing or empty',
                    columns: requiredKeys
                }))
            );
        }

        try {
            const redirect_url = `${config.baseurl}/api/bill_payment/icici-response`;

            const { result, request, redirectUrl } =
                await iciciUtility.IciciInitiateSale(
                    amount,
                    redirect_url,
                    {
                        name: decryptedObject.customer_name || 'Customer',
                        email: decryptedObject.email || 'test@icicibank.com',
                        mobile: decryptedObject.mobile || '9999999999'
                    }
                );

            if (result && result.responseCode === 'R1000') {

                const order_id = utility.generateUniqueNumeric(7);
                const transaction_id = order_id;

                /** Create order */
                const orderData = {
                    user_id: user_id,
                    env: config.env,
                    tran_type: 'Debit',
                    tran_sub_type: 'ICICI BANK',
                    tran_for: 'Add Money',
                    trans_amount: amount,
                    currency: 'INR',
                    order_id,
                    order_status: 'PENDING',
                    created_on: Date.now(),
                    created_by: user_id,
                    ip_address: ipAddress
                };

                const generateorder = await this.db.upi_order.insertData(orderData);

                if (generateorder) {

                    const inputData = {
                        user_id: user_id,
                        transaction_id: transaction_id,
                        merchant_txn_no: request.merchantTxnNo,
                        icici_tran_ctx: result.tranCtx,
                        aggregator_id: request.aggregatorID,
                        order_date: Date.now(),
                        order_amount: amount,
                        redirect_url: redirect_url,
                        status: 'INITIATED',
                        order_response: JSON.stringify(result),
                        payment_status: 0,
                        created_on: Date.now()
                    };

                    await this.db.iciciBankRequest.insertData(inputData);
                }
            }

            return res.status(200).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 200,
                    message: 'ICICI payment initiated successfully',
                    data: {
                        redirect_url: redirectUrl
                    }
                }))
            );

        } catch (error) {
            return res.status(500).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 500,
                    message: error.message,
                    data: error
                }))
            );
        }
    }

    /**
     * ICICI Callback / Response
     */
    async icici_response(req, res) {

        const jsonString = JSON.stringify(req);
        const response_from = 'ICICI BANK';

        const query = `
            INSERT INTO log_payment_gateway_callback
            (callback_response, response_from)
            VALUES (:jsonString, :response_from)
        `;

        await this.db.sequelize.query(query, {
            replacements: {
                jsonString,
                response_from
            },
            type: QueryTypes.INSERT
        });

        return res.send('OK');
    }

    /**
     * ICICI Status Check
     */
    async icici_status_check(req, res) {

        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, merchant_txn_no } = decryptedObject;
        const requiredKeys = Object.keys({ user_id, merchant_txn_no });

        if (!requiredKeys.every(
            key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined
        )) {
            return res.status(400).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 400,
                    message: 'Required input data is missing or empty',
                    columns: requiredKeys
                }))
            );
        }

        try {

            const { result } =
                await iciciUtility.IciciTransactionStatus(merchant_txn_no);

            if (result) {

                const ExistingRequest =
                    await this.db.iciciBankRequest.getData({
                        merchant_txn_no,
                        user_id
                    });

                if (!ExistingRequest) {
                    return res.status(500).json(
                        utility.DataEncrypt(JSON.stringify({
                            status: 500,
                            message: 'Wrong transaction number',
                            data: []
                        }))
                    );
                }

                const updateData = {
                    txn_id: result.txnId || null,
                    transaction_date: result.txnDate || null,
                    payment_amount: result.amount || null,
                    bank_ref_no: result.bankRefNo || null,
                    payment_method_type: result.paymentMode || null,
                    transaction_error_desc: result.responseMessage || null,
                    response_json: JSON.stringify(result),
                    payment_status: (result.responseCode === '00') ? 1 : 2,
                    status: (result.responseCode === '00') ? 'SUCCESS' : 'FAILED'
                };

                await this.db.iciciBankRequest.UpdateData(
                    updateData,
                    { id: ExistingRequest.id, user_id }
                );

                if (result.responseCode === '00') {

                    await this.db.upi_order.update(
                        {
                            order_status: 'SUCCESS',
                            api_response: result.txnId
                        },
                        {
                            where: {
                                user_id,
                                order_id: ExistingRequest.transaction_id,
                                order_status: 'PENDING'
                            }
                        }
                    );

                    const walletData = {
                        transaction_id: ExistingRequest.transaction_id,
                        user_id: user_id,
                        env: config.env,
                        type: 'Credit',
                        amount: result.amount,
                        sub_type: 'Add Money',
                        tran_for: 'main'
                    };

                    await this.db.wallet.insert_wallet(walletData);

                    return res.status(200).json(
                        utility.DataEncrypt(JSON.stringify({
                            status: 200,
                            message: 'Payment done successfully',
                            data: result
                        }))
                    );
                }

                return res.status(500).json(
                    utility.DataEncrypt(JSON.stringify({
                        status: 500,
                        message: 'Payment failed',
                        data: result
                    }))
                );
            }

            return res.status(500).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 500,
                    message: 'Transaction not found',
                    data: []
                }))
            );

        } catch (error) {
            return res.status(500).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 500,
                    message: error.message,
                    data: error
                }))
            );
        }
    }
}

module.exports = new IciciBank();
