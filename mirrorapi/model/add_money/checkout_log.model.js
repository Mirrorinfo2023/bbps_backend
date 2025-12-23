// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class Checkout extends Model {
  
      static async getCount(order_id) {
        try {
          const result = await this.count({
            where: {order_id:order_id}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async getAllTransaction(whereClause) {
        try {
           const transaction = await this.findAll({
                where: { 
                    status: 1,
                    ...whereClause
                }
            });
            return transaction;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async insertData(data) {
        try {
        const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
        }   

    }

    Checkout.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        service: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        payment_getway: {
            type: DataTypes.STRING,
            allowNull: true
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
       
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        }

      },
      {
        sequelize, 
        modelName: 'Checkout',
        tableName: 'log_wallet_checkout', // specify table name here
        timestamps: false
      });
      
    
      return Checkout;
}


