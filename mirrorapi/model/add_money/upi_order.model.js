
const { Sequelize, Model, DataTypes, Op,literal, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class upi_order extends Model {
        
    //   static async insertData(data) {
    //     try {
    //       const result = await this.create(data,{ returning: ['id', 'order_id'] });
    //         return result;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         throw error;
    //     }
    //   }
      
      static async insertData(data) {
      
          try {
              const insertResult = await this.create(data, { returning: ['id', 'order_id'] });
              const insertedId = insertResult.id;
              const reference_no = '1' + String(insertedId).padStart(10, '0');

              const updateResult = await this.update(
                  { reference_no: reference_no },
                  { where: { id: insertedId }, returning: true }
              );
      
              return insertResult;
          } catch (error) {
      
              console.error('Error:', error);
              throw error;
          }
      }

      static async getCount(order_id) {
        try {
          const result = await this.count({
            where: {order_id}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
       static async getAllOrder(tran_sub_type) {
        try {
           const orders = await this.findAll({
              where: { tran_sub_type,order_status:'PENDING' }
            });
            return orders;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
     static async getPendingOrder(order_id,trans_amount) {
        try {
           const orders = await this.findOne({
              where: { order_id,trans_amount,order_status:'PENDING' }
            });
            return orders;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    
      
      
      static async getTodayPendingOrder(todayDate) {
        try {
            
            
    
           const orders = await this.findAll({
              where: { tran_sub_type:'HDFC UPI',tran_for:'Add Money',
               [Op.and]: [
                      literal(`DATE(created_on) = '${todayDate}'`), 
                      { order_status: 'PENDING' }
                ] 
                
              }
            });
            return orders;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    upi_order.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                    model: 'user', // Assuming your Users model is named 'Users'
                    key: 'user_id'
                }
              },
        env: {
              type: DataTypes.STRING,
              allowNull: false
          },
        tran_type: {
              type: DataTypes.STRING,
              allowNull: true
          },
        tran_sub_type: {
              type: DataTypes.STRING,
              allowNull: false
          },
        tran_for: {
              type: DataTypes.STRING,
              allowNull: false
          },
        trans_amount: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        currency: {
          type: DataTypes.STRING,
          allowNull: true
          },
        order_id: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
          },
        order_status: {
          type: DataTypes.STRING,
          allowNull: true
          },
        api_response: {
          type: DataTypes.TEXT,
          allowNull: true
          },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        deleted_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
        modified_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
         deleted_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
         ip_address: {
          type: DataTypes.TEXT,
          allowNull: true
          },
          reference_no: {
            type: DataTypes.STRING,
            allowNull: true
          },
          group_transaction_no: {
            type: DataTypes.STRING,
            allowNull: true
          }

      },
      {
        sequelize, 
        modelName: 'upi_order',
        tableName: 'trans_order_generate', // specify table name here
        timestamps: false
      });
      
      upi_order.belongsTo(sequelize.models.user, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE', // Specify the desired behavior on delete
        onUpdate: 'CASCADE', // Specify the desired behavior on update
      });
    
      return upi_order;
}


