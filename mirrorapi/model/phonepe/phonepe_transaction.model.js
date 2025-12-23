// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class phonePeTransaction extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }


        static async getDataByTransaction(merchant_trancsaction_id,amount) {
            try {
                const Category = await this.findOne({
                    where: {
                        order_id:merchant_trancsaction_id,
                        amount
                    },
                });
                return Category;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getExistingRequest(merchant_trancsaction_id,user_id) {
            try {
                const Category = await this.findOne({
                    where: {
                        transaction_id:merchant_trancsaction_id,
                        user_id
                    },
                });
                return Category;
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

    
    
        static async UpdateData(data , whereClause) {
            try {
            // console.log(data);
            const result = await this.update(data, {
                where: whereClause
            });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

  


    }

    

    phonePeTransaction.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          amount: {
            type: DataTypes.STRING,
            allowNull: false
          },
          request : {
              type: DataTypes.TEXT,
              allowNull: true
         },
         response : {
            type: DataTypes.TEXT,
            allowNull: true
         },
         transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mer_user_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        redirectMode: {
            type: DataTypes.STRING,
            allowNull: true
        },

        paymentInstrument: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
       
        created_on: {
              type: DataTypes.DATE,
              allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        response_status:{
            type: DataTypes.STRING,
            allowNull: true
        },
        redirectUrl:{
            type: DataTypes.STRING,
            allowNull: true
        },
        callback_response:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        order_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
       
       modified_on:{
           type: DataTypes.DATE,
           allowNull: true
       }

  
      },
      {
        sequelize, 
        modelName: 'phonePeTransaction',
        tableName: 'tbl_phonepe_transactions', // specify table name here
        timestamps: false
      });
      
      return phonePeTransaction;
}


