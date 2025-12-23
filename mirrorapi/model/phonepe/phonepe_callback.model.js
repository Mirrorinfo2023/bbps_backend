// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class phonepeCallback extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }


        static async getGraphics(whereClause) {
            const Category = await this.findAll({
                where: whereClause,
                order: [['id', 'DESC']],
            });
            return Category;
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

    

    phonepeCallback.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        callback_enc_response: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        decrypt_resonse: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        response_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          amount: {
            type: DataTypes.STRING,
            allowNull: false
          },

          response_message: {
            type: DataTypes.TEXT,
            allowNull: false
          },
       
          merchant_id : {
              type: DataTypes.STRING,
              allowNull: true
         },
         merchant_trancsaction_id : {
            type: DataTypes.STRING,
            allowNull: true
         },

      
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },

        payment_details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        response_status:{
            type: DataTypes.STRING,
            allowNull: true
        },
        response_from:{
            type: DataTypes.STRING,
            allowNull: true
        },
      
        
  
      },
      {
        sequelize, 
        modelName: 'phonepeCallback',
        tableName: 'log_phonepe_request_response', // specify table name here
        timestamps: false
      });
      
      return phonepeCallback;
}


