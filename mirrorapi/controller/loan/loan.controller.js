const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class LoanModule {
  db = {};

  constructor() {
    this.db = connect();
  }
  

    async getLoanRequestList(req,res) {
    
    //const decryptedObject = utility.DataDecrypt(req.encReq);
    const { page } = req;
    
    
    try {
    
    
    const pages = parseInt(page) || 1;
    const pageSize =  10;
    
    const result = await this.db.LoanRequest.getAllDataList(pages,pageSize);
    
    //utility.DataEncrypt
    if(result) {
    return res.status(200).json({ status: 200, message: 'Product Found', data: result });
    } else {
    return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Request Not Found', data: [] })));
    }
    
    
    }
    catch (err) {
    
    if (err.name === 'SequelizeValidationError') {
    const validationErrors = err.errors.map((err) => err.message);
    return res.status(500).json((JSON.stringify({ status: 500,errors: validationErrors })));
    }
    return res.status(500).json((JSON.stringify({ status: 500,token:'', message: err.message,data: []  })));
    }
    
    
    }

            
        async AddLoanRequest(req,res) {
    
          // const decryptedObject = utility.DataDecrypt(req.encReq);
           
           const {
               user_id,
               rank,
               amount,
               email,
               mobile,
               remarks
               
           } = req;
       
         
        if(amount>20000){
           
            return res.status(500).json(
                 { status: 500,error: 'Loan Request upto 20000.' });
       }
       
               
      const RankCount = await this.db.RoyalityIncome.getCountUser(user_id);
       if(RankCount==0){
           
            return res.status(500).json(
                 { status: 500,error: 'Rank Not Found. Failed to Request' });
       }
             
             
             
        const RequestCount = await this.db.LoanRequest.getPendingCount(user_id);
          if(RequestCount>0){
           
            return res.status(500).json(
                 { status: 500,error: 'Already Applied.' });
       }
        
           
                               
         let t = await this.db.sequelize.transaction();
         
         try {
           
           
              if(RankCount>0 ){
                    
                      const whereChk={user_id:user_id};
          const UserAttribute=['royality_name'];
          const userRank = await this.db.RoyalityIncome.getData(UserAttribute,whereChk);
                    
                    const LData = {
                    
                        user_id,
                        rank:userRank.royality_name,
                        amount,
                        email,
                        mobile,
                        remarks
                    }
                    
                    const results = await this.db.LoanRequest.insertData(LData, { transaction: t });
                    
                    if (results) {
                    
                    await t.commit();
                    return res.status(200).json(
                    { status: 200,  message: 'Loan Request Done successfully' ,data:results});
                    } else {
                    await t.rollback();
                    return res.status(500).json(
                    { status: 500,error: 'Failed to Request' });
                    }
             
              }
              
              
         } catch (error) 
         {
              await t.rollback();
              
           if (error.name === 'SequelizeValidationError') {
             const validationErrors = error.errors.map((err) => err.message);
             return res.status(500).json(
               { status: 500,errors: validationErrors });
           }
           return res.status(500).json({ status: 500,  message: error.message ,data:[]});
         }
         return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
        }
        
        
        async UpdateLoanRequest(req,res) {
    
          // const decryptedObject = utility.DataDecrypt(req.encReq);
           
           const {
               user_id,
               approval_remarks,
               status,
               loan_id
               
           } = req;
       
         
         const RequestCount = await this.db.LoanRequest.getPendingCount(user_id);
        
       
               
      const RankCount = await this.db.RoyalityIncome.getCountUser(user_id);
       if(RankCount==0){
           
            return res.status(500).json(
                 { status: 500,error: 'Rank Not Found. Failed to Request' });
       }
             
           
                               
         let t = await this.db.sequelize.transaction();
         
         try {
           
           
              if(RankCount>0 && RequestCount>0 ){
              
                    
                    const LData = {
                    
                         user_id,
                           approval_remarks,
                           status,
                           modified_on:new Date()
                        
                    }
                    
                    
                    const WhereClause = {
                      id:loan_id,
                      user_id:user_id
                    }
                    
                    
                
                   const results = await this.db.LoanRequest.UpdateData(LData, WhereClause,{ transaction: t });
                    
                    if (results) {
                    
                    await t.commit();
                    return res.status(200).json(
                    { status: 200,  message: 'Loan Request Done successfully' ,data:results});
                    } else {
                    await t.rollback();
                    return res.status(500).json(
                    { status: 500,error: 'Failed to Request' });
                    }
             
              }
              
              
         } catch (error) 
         {
              await t.rollback();
              
           if (error.name === 'SequelizeValidationError') {
             const validationErrors = error.errors.map((err) => err.message);
             return res.status(500).json(
               { status: 500,errors: validationErrors });
           }
           return res.status(500).json({ status: 500,  message: error.message ,data:[]});
         }
         return res.status(400).json({ status: 400,  message: 'Bad request' ,data:[]});
        }
       
       
}

module.exports = new LoanModule();