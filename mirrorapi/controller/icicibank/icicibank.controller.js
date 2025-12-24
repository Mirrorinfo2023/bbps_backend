const { connect, config } = require('../../config/db.config');
const { QueryTypes } = require('sequelize');
const utility = require('../../utility/utility');
const iciciUtility = require('../../utility/icicibank.utility');

class IciciBank {

    constructor() {
        this.db = connect();
    }

    /**
     * ======================================
     * ICICI INITIATE PAYMENT
     * ======================================
     */
    async icici_request(req, res, ipAddress) {
        try {
            const { user_id, amount, customer_name, email, mobile } = req;

            // ✅ Validate input
            if (!user_id || !amount || !customer_name || !email || !mobile) {
                return res.status(400).json(
                    utility.DataEncrypt(JSON.stringify({
                        status: 400,
                        message: 'Required input data is missing'
                    }))
                );
            }


            // ✅ Initiate ICICI sale
            const { response, request, redirectUrl } =
                await iciciUtility.IciciInitiateSale(amount, {
                    name: customer_name,
                    email,
                    mobile
                });

            // ✅ Validate ICICI response
            if (!response || response.responseCode !== 'R1000') {
                return res.status(500).json(
                    utility.DataEncrypt(JSON.stringify({
                        status: 500,
                        message: 'ICICI payment initiation failed',
                        data: response || {}
                    }))
                );
            }

            const order_id = utility.generateUniqueNumeric(7);

            // ✅ Create order
            await this.db.upi_order.insertData({
                user_id,
                env: config.env,
                tran_type: 'Debit',
                tran_sub_type: 'ICICI BANK',
                tran_for: 'Add Money',
                trans_amount: amount,
                currency: 'INR',
                order_id,
                order_status: 'PENDING',
                created_on: new Date(),
                created_by: user_id,
                ip_address: ipAddress
            });

            // ✅ Save ICICI request mapping
            await this.db.IciciBankRequest.insertData({
                user_id,
                transaction_id: order_id,
                merchant_txn_no: request.merchantTxnNo,
                icici_tran_ctx: response.tranCtx,
                aggregator_id: request.aggregatorID,
                order_date: new Date(),
                order_amount: amount,
                redirect_url: redirectUrl,
                status: 'INITIATED',
                order_response: JSON.stringify(response),
                payment_status: 0,
                created_on: new Date()
            });

            // ✅ Final response
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
                    message: error.message || 'Internal Server Error'
                }))
            );
        }
    }

    /**
     * ======================================
     * ICICI CALLBACK / RESPONSE
     * ======================================
     */
    async icici_response(req, res) {
        try {
            console.log('ICICI callback received:', req.body);

            // Save callback to DB
            await this.db.sequelize.query(
                `INSERT INTO log_payment_gateway_callback
             (callback_response, response_from)
             VALUES (:json, 'ICICI BANK')`,
                { replacements: { json: JSON.stringify(req.body) }, type: QueryTypes.INSERT }
            );

            // Verify ICICI response
            const isValid = iciciUtility.verifyIciciResponse(req.body);

            // Update your DB based on status
            if (isValid) {
                const status = req.body.responseCode === 'R1000' ? 'SUCCESS' : 'FAILED';
                await this.db.upi_order.update(
                    { order_status: status },
                    { where: { order_id: req.body.merchantTxnNo } }
                );
            }

            // Redirect user to frontend success/failure page
            const frontendUrl =
                req.body.responseCode === 'R1000'
                    ? 'https://secure.mirrorinfo.in/payment-success'
                    : 'https://secure.mirrorinfo.in/payment-failed';

            return res.redirect(frontendUrl);

        } catch (error) {
            console.error(error);
            return res.send('OK'); // always respond OK to ICICI
        }
    }


    /**
     * ======================================
     * ICICI STATUS CHECK
     * ======================================
     */
    async icici_status_check(req, res) {
        try {
            const decryptedObject = utility.DataDecrypt(req.encReq);
            const { user_id, merchant_txn_no } = decryptedObject;

            if (!user_id || !merchant_txn_no) {
                return res.status(400).json(
                    utility.DataEncrypt(JSON.stringify({
                        status: 400,
                        message: 'Required fields missing'
                    }))
                );
            }

            const { result } =
                await iciciUtility.IciciTransactionStatus(merchant_txn_no);

            if (!result) {
                return res.status(404).json(
                    utility.DataEncrypt(JSON.stringify({
                        status: 404,
                        message: 'Transaction not found'
                    }))
                );
            }

            return res.status(200).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 200,
                    data: result
                }))
            );

        } catch (error) {
            return res.status(500).json(
                utility.DataEncrypt(JSON.stringify({
                    status: 500,
                    message: error.message || 'Status check failed'
                }))
            );
        }
    }
}

module.exports = new IciciBank();
