//const { connecthub } = require('../../config/hubdb.config');
const { connectshop } = require('../../config/shopdb.config');
const { connect } = require('../../config/db.config');
const utility = require('../../utility/utility'); 
const { sequelize, DataTypes } = require('sequelize');

const fs = require('fs');

class cronJobAddMoney {
     //hubdb = {};
     db = {};
     shopdb = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        //this.hubdb = connecthub();
        this.db = connect();
        this.shopdb = connectshop();
    }

    // async WalletJob() {
        
       
        
    //     try {
            
    //         const UPITransaction = await this.hubdb.Transaction.getAllTransaction();
    //         //upi_order.getAllOrder('HDFC UPI');
    //         const transaction =await this.db.sequelize.transaction();
            
    //         try {
                
    //                 for (const order of UPITransaction) {
                        
    //                   // console.log(`upi order ${order.mer_txn_ref}`);
                     
    //                  const UPIorder = await this.db.upi_order.getPendingOrder(order.mer_txn_ref,order.amount);
    //                   if(UPIorder && UPIorder.order_id>0){
    //                       const userDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: UPIorder.user_id});
    //                       const reference_no = '1' + String(UPIorder.id).padStart(10, '0');
    //                       //api_response:order.cust_ref_no 
    //                       const updateResult1 = await this.db.upi_order.update(
    //                           {order_status:'SUCCESS',api_response:order.cust_ref_no,reference_no:reference_no },
    //                           { where: { user_id:UPIorder.user_id,order_id:UPIorder.order_id,order_status:'PENDING' }, transaction }
    //                       );
                    
                    
    //                         if(updateResult1[0]>0){
                                
    //                             const transactionData={
    //                                 transaction_id:UPIorder.order_id,
    //                                 user_id:UPIorder.user_id,
    //                                 env:'PROD',
    //                                 type:'Credit',
    //                                 amount:order.amount,
    //                                 sub_type:'Add Money',
    //                                 tran_for:'main'
    //                             };
                                
    //                             const wallet=await this.db.wallet.insert_wallet(transactionData);
                                
    //                             if(wallet && wallet.error !== undefined && wallet.error === 0){
                                    
    //                                 const passbookData={
    //                                     transaction_id:UPIorder.order_id,
    //                                     user_id:UPIorder.user_id,
    //                                     env:'PROD',
    //                                     type:'Credit',
    //                                     amount:order.amount,
    //                                     tran_for:'Add Money',
    //                                     ref_tbl_id:wallet.createdId
    //                                 };
                                    
    //                                 await this.db.passbook.insert_passbook(passbookData);
                                    
    //                                 await this.hubdb.Transaction.update(
    //                                       {add1:'Success' },
    //                                       { where: { mer_txn_ref:order.mer_txn_ref } }
    //                                   );
                                    
                                    
    //                             }
                                
                                

    //                             // const messages = {
    //                             //     user_id: UPIorder.user_id,
    //                             //     service: 'Add Money', 
    //                             //     message_id: `M${utility.generateUniqueNumeric(7)}`,
    //                             //     msg_notification: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.amount} added to your wallet via HDFC UPI`,
    //                             //     msg_whatsup: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.amount} added to your wallet via HDFC UPI`,
    //                             //     msg_email: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.amount} added to your wallet via HDFC UPI`,
    //                             //     msg_sms: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.amount} added to your wallet via HDFC UPI`,
    //                             //     invoice_no: reference_no,
    //                             //     invoice_date: UPIorder.created_on,
    //                             //     transaction_id: UPIorder.order_id,
    //                             //     amount: order.amount,
    //                             //     getway: 'HDFC UPI',
    //                             //     bank_ref_no: order.cust_ref_no,
    //                             //     tracking_id: order.cust_ref_no,
    //                             //     payment_date: UPIorder.created_on,
    //                             //     gateway_order_id: order.mer_txn_ref,
    //                             //     order_id: order.mer_txn_ref
    //                             // }

    //                             // await this.db.messagingService.insertData(messages);
                                
                                
    //                         }
                            
                            
                            
                          
    //                      }
                      
                     
                        
                        
    //                 }

                
            
    //             await transaction.commit();
                
    //         } catch (error) {
    //             // Handle errors during table updates
    //             console.error('Error in updating tables:', error);
            
    //             // Roll back the transaction if an error occurs
    //             await transaction.rollback();
    //             console.log('Transaction rolled back');
    //             throw error;
    //           }
            
            
    //     } catch (err) {
    //         console.error('Error in upi walletjob :', err.message);
    //     }
    // }
    
    async WalletJobCCAvenue() {
        try 
        {
            
            const CCAvanueTransaction = await this.shopdb.gateway.getAllTransaction();
            const transaction =await this.db.sequelize.transaction();
            

            try 
            {
                
                for (const order of CCAvanueTransaction) 
                {
                    
                    const orderData = JSON.parse(order.request_jons);
                    const transaction_id = orderData.transaction_id;
                    const UPIorder = await this.db.upi_order.getPendingOrder(transaction_id,order.order_amount);
                    
                    if(UPIorder && UPIorder.order_id>0)
                    {
                        const userDetails = await this.db.user.getData(['id', 'first_name', 'last_name','mobile'], {id: UPIorder.user_id});
                        const reference_no = '1' + String(UPIorder.id).padStart(10, '0');

                        const updateResult1 = await this.db.upi_order.update(
                            {order_status:'SUCCESS',api_response:order.status_message, reference_no:reference_no },
                            { where: { user_id:UPIorder.user_id, order_id:UPIorder.order_id, order_status:'PENDING' }, transaction }
                        );
            
            
                        if(updateResult1[0]>0)
                        {
                            
                            const transactionData={
                                transaction_id:UPIorder.order_id,
                                user_id:UPIorder.user_id,
                                env:'PROD',
                                type:'Credit',
                                amount:order.order_amount,
                                sub_type:'Add Money',
                                tran_for:'main'
                            };
                            
                            const wallet=await this.db.wallet.insert_wallet(transactionData);
                            
                            if(wallet && wallet.error !== undefined && wallet.error === 0)
                            {
                                
                                await this.shopdb.gateway.update(
                                    { wallet_update_status:1 },
                                    { where: { id: order.id } }
                                );
                                
                            }
                            
                            // const messages = {
                            //     user_id: UPIorder.user_id,
                            //     service: 'Add Money', 
                            //     message_id: `M${utility.generateUniqueNumeric(7)}`,
                            //     msg_notification: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.order_amount} added to your wallet via CCAVENUE`,
                            //     msg_whatsup: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.order_amount} added to your wallet via CCAVENUE`,
                            //     msg_email: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.order_amount} added to your wallet via CCAVENUE`,
                            //     msg_sms: `Dear ${userDetails.first_name} ${userDetails.last_name}, Rs.${order.order_amount} added to your wallet via CCAVENUE`,
                            //     invoice_no: reference_no,
                            //     invoice_date: UPIorder.created_on,
                            //     transaction_id: UPIorder.order_id,
                            //     amount: order.order_amount,
                            //     getway: 'CCAVENUE',
                            //     bank_ref_no: order.tracking_id,
                            //     tracking_id: order.tracking_id,
                            //     payment_date: UPIorder.created_on,
                            //     gateway_order_id: order.order_id,
                            //     order_id: order.order_id
                            // }

                            // await this.db.messagingService.insertData(messages);
                        
                        }
                    
                    }
                                            
                }
            
                await transaction.commit();
                
            } catch (error) {
                console.error('Error in updating tables:', error);
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
            }
            
            
        } catch (err) {
            console.error('Error in CCavenue walletjob :', err);
        }
    }
}

module.exports = new cronJobAddMoney();
