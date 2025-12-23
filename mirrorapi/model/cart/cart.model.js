module.exports = (sequelize, DataTypes, Model) => {

    class Cart extends Model {

        static async addOrUpdateProduct(userId, productId, packageId, quantity, price) {
            try {
                const existingCartItem = await this.findOne({
                    where: {
                        user_id: userId,
                        product_id: productId,
                        package_id: packageId
                    }
                });
        
                if (existingCartItem) {
                    const newQuantity = parseInt(existingCartItem.quantity) + parseInt(quantity);
                    const newTotalPrice = newQuantity * price;
        
                    await this.update({
                        quantity: newQuantity,
                        price:price,
                        totalprice: newTotalPrice
                    }, {
                        where: {
                            id: existingCartItem.id
                        }
                    });
        
                    // Fetch the updated cart item
                    const updatedCartItem = await this.findOne({
                        where: {
                            id: existingCartItem.id
                        }
                    });
        
                    return { error: 0, message: 'Cart updated', result: updatedCartItem };
                } else {
                    // Insert new cart item
                    const totalPrice = quantity * price;
                    const newCartItem = await this.create({
                        user_id: userId,
                        product_id: productId,
                        package_id: packageId,
                        quantity: quantity,
                        price: price,
                        totalprice: totalPrice
                    });
        
                    return { error: 0, message: 'Product added to cart', result: newCartItem };
                }
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getCartList(userId) {
            try {

                const cartItems = await this.findAll({
                    where: { user_id: userId }
                });

                return { error: 0, message: 'Cart items retrieved', result: cartItems };
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
       
       
        static async findCartItem(userId, productId) {
            try {
                return await this.findOne({
                    where: {
                        user_id: userId,
                        product_id: productId
                    }
                });
            } catch (error) {
                console.error('Error finding cart item:', error);
                throw error;
            }
        }
    

    }


    Cart.init({
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        package_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        totalprice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
       
    }, {
        sequelize,
        modelName: 'Cart',
        tableName: 'tbl_cart',
        timestamps: false
    });
    
    Cart.associate = function(models) {
        Cart.belongsTo(models.Product, { foreignKey: 'product_id' });
        Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    };
    
    
    return Cart;

}


