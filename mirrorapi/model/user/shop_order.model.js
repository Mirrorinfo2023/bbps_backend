// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class Order extends Model {
  
      static async getCount(order_id) {
        try {
          const result = await this.count({
            where: {id:order_id, order_status:'Delivered'}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async getIncomeCreditOrders() {
          try {
            const rawQuery = `
              SELECT orders.*,users.user_id,seller_user.user_id as seller_user_id
              FROM orders 
              join users on orders.customer_id=users.id
              join sellers on orders.seller_id=sellers.id
              left join users as seller_user on sellers.user_id=seller_user.id
              WHERE orders.order_status = 'confirmed' and orders.income_credit=0
            `;
  
            const shopOrders = await sequelize.query(rawQuery, {
              type: sequelize.QueryTypes.SELECT,
            });
            return shopOrders;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }

    }

    Order.init({
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
		    primaryKey: true,
		    autoIncrement: true
        },
        customer_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        order_status: {
              type: DataTypes.STRING,
              allowNull: false
        },
        transaction_ref: {
              type: DataTypes.STRING,
              allowNull: false
        },
        payment_method: {
          type: DataTypes.STRING,
          allowNull: false
        },
        order_amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        seller_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        seller_is: {
          type: DataTypes.STRING,
          allowNull: true
        },
        income_credit: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
          

      },
      {
        sequelize, 
        modelName: 'Order',
        tableName: 'orders', // specify table name here
        timestamps: false
      });
      

    
      return Order;
}


