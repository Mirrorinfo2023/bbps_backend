// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class Transaction extends Model {
  
      static async getCount(order_id) {
        try {
          const result = await this.count({
            where: {mer_txn_ref:order_id}
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
             where: { status:'SUCCESS',add1:'null',cdt: {
                [Sequelize.Op.gte]: '2024-02-27',
                 },
            },
             attributes: ['mer_txn_ref','amount', 'status', 'add1','trans_auth_date', 'cust_ref_no'],
            });
            return transaction;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
       static async getAllOrderTransaction(order_id,trans_amount) {
        try {
           const transaction = await this.findOne({
             where: { status:'SUCCESS',mer_txn_ref:order_id,amount:trans_amount,add1:'null',cdt: {
                [Sequelize.Op.gte]: '2024-02-27',
                 },
            },
             attributes: ['mer_txn_ref','amount', 'status', 'add1','trans_auth_date', 'cust_ref_no'],
            });
            return transaction;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    Transaction.init({
      
        upi_txn_id: {
              type: DataTypes.STRING,
              allowNull: false
          },
        mer_txn_ref: {
              type: DataTypes.STRING,
              allowNull: true
          },
        amount: {
              type: DataTypes.STRING,
              allowNull: false
          },
        trans_auth_date: {
              type: DataTypes.STRING,
              allowNull: false
          },
        status: {
          type: DataTypes.STRING,
          allowNull: false
          },
        status_desc: {
          type: DataTypes.STRING,
          allowNull: true
          },
        response_code: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
          },
        approval_number: {
          type: DataTypes.STRING,
          allowNull: true
          },
        payer_vadd: {
          type: DataTypes.STRING,
          allowNull: true
          },
        cust_ref_no: {
          type: DataTypes.STRING,
          allowNull: true
          },
        reference_id: {
          type: DataTypes.STRING,
          allowNull: true
          },
        add1: {
          type: DataTypes.STRING,
          allowNull: true
          },
          

      },
      {
        sequelize, 
        modelName: 'Transaction',
        tableName: 'transaction_details', // specify table name here
        timestamps: false
      });
      

    
      return Transaction;
}


