
const { connect } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility');
const { paginate } = require('../../utility/pagination.utility'); 

class Cart {
    
    db = {};

    constructor() {
      this.db = connect();
    }
    
    
    async addToCart(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, product_id, package_id, quantity } = decryptedObject;
        
        const requiredKeys = Object.keys({ user_id, product_id, package_id, quantity });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }

        try {

            const product = await this.db.Product.findProductById(product_id);
    
            if (product==null) {
                // return res.status(404).json({ status: 404, message: 'Product not found' });
                return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Product not found' })));
            }
            
            if(await this.db.Package.count({where:{id: package_id}}) == 0)
            {
                // return res.status(404).json({ status: 404, message: 'Invalid package selection' });
                return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Invalid package selection' })));
            }
    
            const price = product.purchase_price;
            const results = await this.db.Cart.addOrUpdateProduct(user_id, product_id, package_id, quantity, price);
    
            if (results) {
                const response = { status: 200, message: results.message, data: results.result};
                // return res.status(200).json(response);
                return res.status(200).json(utility.DataEncrypt(JSON.stringify(response)));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                // return res.status(500).json({ status: 500, errors: validationErrors });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors:'Internal Server Error', data:validationErrors })));
            }
            // return res.status(500).json({ status: 500, message: error.message, data: [] });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
        }
    }
    

    async getCartList(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id } = decryptedObject;
        
        const requiredKeys = Object.keys({ user_id });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
    
        try {

            const cartResults = await this.db.Cart.getCartList(user_id);
    
            if (cartResults.error === 0 && cartResults.result) {
  
                const cartItems = await Promise.all(cartResults.result.map(async (cartItem) => {
                    const product = await this.db.Product.findByPk(cartItem.product_id, {
                        attributes: ['name', 'details', 'purchase_price']
                    });
                    
                    const productImages = await this.db.ProductImages.findAll({where: {product_id: cartItem.product_id}});
                    
                    const productData = {
                        ...product.dataValues,
                        images: productImages
                    }
    
                    return {
                        ...cartItem.toJSON(),
                        ...productData
                    };
                }));
    
                // Calculate total price
                const cart_totalprice = cartItems.reduce((sum, item) => {
                  const price = item.purchase_price || 0;
                  const quantity = item.quantity || 1;
                  return sum + (price * quantity);
                }, 0);
    
                // return res.status(200).json({ status: 200, message: cartResults.message, data: cartItems, cart_totalprice: cart_totalprice });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: cartResults.message, data: cartItems, cart_totalprice: cart_totalprice })));
            } else {
                // return res.status(404).json({ status: 404, message: 'Your cart is empty!'});
                return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Your cart is empty!'})));
            }
        } catch (error) {
            console.error('Error fetching cart list:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                // return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data:validationErrors })));
            }
            // return res.status(500).json({ status: 500, message: error.message, data: [] });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
        }
    }
    

    async updateCartItem(req, res) {
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id, product_id, action } = decryptedObject; 
        
        const requiredKeys = Object.keys({ user_id, product_id, action });
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
        }
        
        const actionArr = ['Increment', 'Decrement', 'Delete'];
        
        if(!actionArr.includes(action))
        {
            // return res.status(400).json({ status: 400, message: 'Action not matched', columns: actionArr });
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Action not matched', columns: actionArr })));
        }
    
        try {
            
            const product = await this.db.Cart.findOne({
                where: {
                    user_id: user_id,
                    product_id: product_id
                }
            });
    
            if (product==null) {
                // return res.status(404).json({ status: 404, message: 'Product not found' });
                return res.status(404).json(utility.DataEncrypt(JSON.stringify({ status: 404, message: 'Product not found' })));
            }
    
            const price = product.price;
            const package_id = product.package_id;
            const oldQty = product.quantity;
            let qty = oldQty;
            
            if(action === 'Increment')
            {
                qty = parseInt(oldQty) + 1;
            }
            
            if(action === 'Decrement')
            {
                qty = parseInt(oldQty) - 1;
            }
            
            if(action === 'Delete')
            {
                 await this.db.Cart.destroy({
                    where: {
                        id: product.id
                    }
                });
                
                // return res.status(200).json({ status: 200, message: 'Cart item removed', data:[] });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200, message: 'Cart item removed', data:[] })));
            }
            const totalprice = qty * price;

            const results = await this.db.Cart.update({
                    quantity: qty,
                    price:price,
                    totalprice: totalprice
                }, {
                    where: {
                        id: product.id
                    }
                });
             
            if (results) { 

                // return res.status(200).json({status: 200, message: 'Cart updated successfully', data:results });
                return res.status(200).json(utility.DataEncrypt(JSON.stringify({status: 200, message: 'Cart updated successfully', data:results })));
            }
        } catch (error) {
            console.error('Error incrementing cart quantity:', error);
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map((err) => err.message);
                // return res.status(500).json({ status: 500, errors: 'Internal Server Error', data:validationErrors });
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, errors: 'Internal Server Error', data:validationErrors })));
            }
            // return res.status(500).json({ status: 500, message: error.message, data: [] });
            return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500, message: error.message, data: [] })));
        }
    }
    
    
   
    
}

module.exports = new Cart();

 

    
        

