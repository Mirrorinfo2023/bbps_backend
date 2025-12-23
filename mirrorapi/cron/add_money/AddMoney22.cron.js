const { connecthub } = require('../../config/hubdb.config');
const { connect } = require('../../config/db.config');
const { sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

class cronJobAddMoney {
     hubdb = {};
     db = {};

    constructor() {
 
        this.logFilePath = 'cron.log';
        this.hubdb = connecthub();
        this.db = connect();
    }

    async WalletJob() {
        
       
        
        try {
            
             const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
            const day = String(currentDate.getDate()).padStart(2, '0');
            const todayDate = `${year}-${month}-${day}`;
           
             const UPITransaction = await this.db.upi_order.getTodayPendingOrder(todayDate);
            //upi_order.getAllOrder('HDFC UPI');
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
                    for (const order of UPITransaction) {
                        
                       // console.log(`upi order ${order.mer_txn_ref}`);
                     
                    // const UPIorder = await this.db.upi_order.getPendingOrder(order.mer_txn_ref,order.amount);
                      const UPIorder = await this.hubdb.Transaction.getAllOrderTransaction(order.order_id,order.trans_amount);
                      
                      if(UPIorder && UPIorder.mer_txn_ref !=null){
                          
                          console.log(`upi order update starting`);
                          
                          const reference_no = '1' + String(order.id).padStart(10, '0');
                          //api_response:order.cust_ref_no 
                          const updateResult1 = await this.db.upi_order.update(
                              {order_status:'SUCCESS',api_response:UPIorder.cust_ref_no,reference_no:reference_no },
                              { where: { user_id:order.user_id,order_id:order.order_id,order_status:'PENDING' }, transaction }
                          );
                    
                        console.log(`upi order updated`);
                    
                            if(updateResult1[0]>0){
                                
                                const transactionData={
                                    transaction_id:order.order_id,
                                    user_id:order.user_id,
                                    env:'PROD',
                                    type:'Credit',
                                    amount:UPIorder.amount,
                                    sub_type:'Add Money',
                                    tran_for:'main'
                                };
                                
                                const wallet=await this.db.wallet.insert_wallet(transactionData);
                                
                                if(wallet && wallet.error !== undefined && wallet.error === 0){
                                    
                                    const passbookData={
                                        transaction_id:order.order_id,
                                        user_id:order.user_id,
                                        env:'PROD',
                                        type:'Credit',
                                        amount:UPIorder.amount,
                                        tran_for:'Add Money',
                                        ref_tbl_id:wallet.createdId
                                    };
                                    
                                    await this.db.passbook.insert_passbook(passbookData);
                                    
                                    await this.hubdb.Transaction.update(
                                          {add1:'Success' },
                                          { where: { mer_txn_ref:UPIorder.mer_txn_ref } }
                                      );
                                    
                                    
                                }
                                
                                
                            }
                          
                         }
                      
                     
                        
                        
                    }

                
            
                await transaction.commit();
                
            } catch (error) {
                // Handle errors during table updates
                console.error('Error in updating tables:', error);
            
                // Roll back the transaction if an error occurs
                await transaction.rollback();
                console.log('Transaction rolled back');
                throw error;
              }
            
            
        } catch (err) {
            console.error('Error in upi walletjob :', err);
        }
    }
}

module.exports = new cronJobAddMoney();
