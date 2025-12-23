
const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class CustomerCart {
  db = {};

  constructor() {
    this.db = connect();
  }
  

  async addCart(req, res) {
    const { product_img,product_id, name, details, price, discount, total_qnty, totalprice, delivery_date} = req.body;

    // Check for required fields
    const requiredKeys = { product_img, product_id,name, details, price, discount, total_qnty,totalprice };
    if (!Object.values(requiredKeys).every(value => value !== '' && value !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: Object.keys(requiredKeys) });
    }

    try {
        const newCart = await this.db.CustomerCart.createCart({ product_img, product_id,name, details, price, discount, total_qnty, totalprice, delivery_date});

        if (newCart.error === 0) {
            return res.status(201).json({ status: 201, message: 'Item Added To Cart Successfully', data: newCart.result });
        } else {
            return res.status(500).json({ status: 500, message: 'Failed to Create Address', data: [] });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ status: 500, message: error.message, data: [] });
    }
}




  async getCart(req,res) {
	  
    //const decryptedObject = utility.DataDecrypt(req.encReq);
    const { page } = req;

   
    try {
 
      
      const pages = parseInt(page) || 1;
      const pageSize =  10;
    
      const result = await this.db.CustomerCart.getCart(pages,pageSize);
     
    //utility.DataEncrypt
    if(result) {
        return res.status(200).json({ status: 200, message: 'Cart Found', data: result });
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


    
        
module.exports = new CustomerCart();
