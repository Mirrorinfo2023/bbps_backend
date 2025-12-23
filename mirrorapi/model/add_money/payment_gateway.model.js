// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class PaymentGateway extends Model {
  
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
      
        static async getAllTransaction() {
        try {
           const transaction = await this.findAll({
                where: { 
                    status: 1, 
                    wallet_update_status:0,
                    payment_status: 1,
                    order_status: 'Success'
                }
            });
            return transaction;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    PaymentGateway.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        vendor_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        order_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        request_jons: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        order_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        response_json: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        payment_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        tracking_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status_message: {
            type: DataTypes.STRING,
            allowNull: true
        },
        failure_message: {
            type: DataTypes.STRING,
            allowNull: true
        },
        wallet_update_status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_on: {
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
        modelName: 'PaymentGateway',
        tableName: 'tbl_payment_gateway_request_response', // specify table name here
        timestamps: false
      });
      
    
      return PaymentGateway;
}


