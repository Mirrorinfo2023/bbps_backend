const { connect,config } = require('../../config/db.config');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const { paginate } = require('../../utility/pagination.utility'); 

class IdCardDeatils {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	

    async idCard_report(req,res) {
	     
	    const { from_date, to_date, page } = req;
        
        const requiredKeys = Object.keys({ from_date, to_date });
            
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
	  
        
        try {
            const fromDate = new Date(from_date);
            const toDate = new Date(to_date);
            fromDate.setHours(0, 0, 0);
            toDate.setHours(23, 59, 59);
            const pagecount = (page)?page:1;

            const whereClause = {
                'created_on': {
                [Op.between]: [fromDate, toDate]
            } }

            const result = await paginate(this.db.viewIdCard, {
                whereClause,
                order: [['created_on', 'DESC']],
                page: pagecount
            });
            
            const report={                    
                totalRequestsCount:await this.db.viewIdCard.count({ where: {...whereClause} }),
                totalPendingRequests:await this.db.viewIdCard.count({ where:{...whereClause, status:1 } }),
                totalIssueRequests:await this.db.viewIdCard.count({ where:{...whereClause, status:2 } }),
                totalRejectedRequests_view:await this.db.viewIdCard.count({ where:{...whereClause, status:3 } }),
             }
            
            if(result !==null){
                return res.status(200).json({ status: 200, message:'Successfully all record found', data: result.data, totalPageCount: result.totalPageCount, report });
            }
        
            return res.status(400).json({ status: 400, message:'Record not found',data:[] });
        }
        catch (err) {
            if (err.name === 'SequelizeValidationError') {
                const validationErrors = err.errors.map((err) => err.message);
                return res.status(500).json({ status: 500,errors:'Internal Server Error' ,data:validationErrors });
            }
                return res.status(500).json({ status: 500, message: err.message ,data: []  });
        }
	

    }

    async updateIdCardStatus(req, res, ipAddress) {
        const {idCard_id,action,note,status} = req;
        const requiredKeys = Object.keys({ idCard_id,action,note,status});
                
        if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined) ) {
            return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }
        
        
        try {
            
            const currentDate = new Date();
            const amount = 99;
            const getIdCardData = await this.db.userIdCard.getData(['user_id'], {id: idCard_id});

            if(getIdCardData)
            {
                const user_id = getIdCardData.user_id;
                const updatedStatus = await this.db.userIdCard.updateData(
                                                                    {
                                                                        rejection_reason:note,
                                                                        status,
                                                                        modified_on:currentDate.getTime()
                                                                    },
                                                                    
                                                                    {id:idCard_id}
                                                                    
                                                                    );

                if(status==3 && action=='Reject' && note!=null)
                {
                    const transaction_id = utility.generateUniqueNumeric(7);

                    const orderData = {
                        user_id,
                        env:config.env, 
                        tran_type:'Credit',
                        tran_sub_type:'Id Card',
                        tran_for:'Id Card Refund Amount',
                        trans_amount: amount,
                        currency:'INR',
                        order_id:transaction_id,
                        order_status:'PENDING',
                        created_on: Date.now(),
                        created_by: user_id,
                        ip_address: ipAddress
                    };
                    
                    const generateorder = await this.db.upi_order.insertData(orderData); 
                    
                    if(generateorder)
                    {
                        const walletData={
                            transaction_id:transaction_id,
                            user_id,
                            env:config.env,
                            type:'Credit',
                            amount:amount,
                            sub_type:'Id Card refund',
                            tran_for:'main'
                        };
                    
                        await this.db.wallet.insert_wallet(walletData);
                        await this.db.upi_order.update(
                            {order_status: 'SUCCESS' },
                            { where: { user_id:user_id,order_id:transaction_id } }
                        );

                    }
                }
                if (updatedStatus > 0) {
                    return res.status(200).json({ status: 200, message: 'Updated Successful.'});
                } else {
                    return res.status(500).json({ status: 500, message: 'Failed to Update data', data: [] });
                }
            }else{
                return res.status(500).json({ status: 500, message: 'Wrong credentials ', data: [] });
            }
                
            
                
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
            }
            
            return res.status(500).json({ status: 500, message: error.message, data:[]});
        }
    }
    
    
}




module.exports = new IdCardDeatils();