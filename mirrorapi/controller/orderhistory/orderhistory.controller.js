const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class OrderHistory {
  db = {};

  constructor() {
    this.db = connect();
  }
  


  async getOrderhistory(req,res) {
	  
    //const decryptedObject = utility.DataDecrypt(req.encReq);
    const { page } = req;

   
    try {
 
      
      const pages = parseInt(page) || 1;
      const pageSize =  10;
    
      const result = await this.db.OrderHistory.getOrderhistory(pages,pageSize);
     
    //utility.DataEncrypt
    if(result) {
        return res.status(200).json({ status: 200, message: 'Order Found', data: result });
    } else {
        return res.status(401).json(utility.DataEncrypt(JSON.stringify({ status: 401, token: '', message: 'Order Not Found', data: [] })));
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

}


    
        
module.exports = new OrderHistory();