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
            
            //const UPITransaction = await this.hubdb.Transaction.getAllTransaction();
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
            const day = String(currentDate.getDate()).padStart(2, '0');
            const todayDate = `${year}-${month}-${day}`;
            
            const UPIorder = await this.db.upi_order.getTodayPendingOrder(todayDate);
            //order.mer_txn_ref,order.amount
            
            //upi_order.getAllOrder('HDFC UPI');
            const transaction =await this.db.sequelize.transaction();
            
            try {
                
                    for (const order of UPIorder) {
                        
                        console.log(`upi order ${order.order_id}`);
                     
                    // const UPIorder = await this.db.upi_order.getPendingOrder(order.mer_txn_ref,order.amount);
                    //UPIorder && UPIorder.order_id>0
                      if(true){
                          
                         
                            
                             const [affectedRows, updatedRows]=  await this.hubdb.Transaction.update(
                                          { add1: 'Success' },
                                          {
                                            where: { mer_txn_ref: order.order_id },
                                            returning: true,
                                          }
                                      );
                    
                            if (affectedRows > 0 && updatedRows.length > 0) {
                                
                                    const updatedRecord = updatedRows[0];
                                    const cust_ref_no = updatedRecord.cust_ref_no;
                                
                                  const updateResult12 = await this.db.upi_order.update(
                                      {order_status:'SUCCESS',api_response:cust_ref_no},
                                      { where: { user_id:order.user_id,order_id:order.order_id,order_status:'PENDING' }, transaction }
                                  );
                                
                                 if(updateResult12[0]>0){
                                     
                                     
                                     
                                      const transactionData={
                                            transaction_id:order.order_id,
                                            user_id:order.user_id,
                                            env:'PROD',
                                            type:'Credit',
                                            amount:order.amount,
                                            sub_type:'Add Money',
                                            tran_for:'main'
                                        };
                                        
                                        const wallet=await this.db.wallet.insert_wallet(transactionData);
                                 }
                               
                                
                                //if(wallet && wallet.error !== undefined && wallet.error === 0){
                                    
                                    // const passbookData={
                                    //     transaction_id:UPIorder.order_id,
                                    //     user_id:UPIorder.user_id,
                                    //     env:'PROD',
                                    //     type:'Credit',
                                    //     amount:order.amount,
                                    //     tran_for:'Add Money',
                                    //     ref_tbl_id:wallet.createdId
                                    // };
                                    
                                    // await this.db.passbook.insert_passbook(passbookData);
                                    
                                  //api_response:order.cust_ref_no 
                        
                                    
                                    
                               // }
                                
                                
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
