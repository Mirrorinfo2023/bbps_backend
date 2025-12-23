// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class add_money_view extends Model {

        static async getAddMoneyData() {
            try {
               const transaction = await this.findAll({
                //  where: { status:'SUCCESS',add1:'null',cdt: {
                //     [Sequelize.Op.gte]: '2023-11-30',
                //      },
                // },
                //  attributes: ['mer_txn_ref','amount', 'status', 'add1','trans_auth_date'],
                });
                return transaction;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
          
          
          static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({
                  where: whereCondition,
                    order: [['created_on', 'DESC'],['status', 'ASC']],
                  
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }

    }

    add_money_view.init({
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
              type: DataTypes.INTEGER,
              allowNull: false
          },
        status: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
        category: {
              type: DataTypes.STRING,
              allowNull: false
          },
        trans_no: {
              type: DataTypes.STRING,
              allowNull: false
          },
        img: {
          type: DataTypes.STRING,
          allowNull: false
          },
        amr_aw: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
        rejection_reason: {
          type: DataTypes.STRING,
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
        updated_by: {
          type: DataTypes.INTEGER,
          allowNull: true
          },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        
        mobile: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique:true
        },
        request_date: {
          type: DataTypes.STRING,
          allowNull: false,
          
        },
        wallet: {
          type: DataTypes.STRING,
          allowNull: true,
          
        }
          
          
          
          
        
  
      },
      {
        sequelize, 
        modelName: 'add_money_view',
        tableName: 'view_add_money_request', // specify table name here
        timestamps: false
      });
      
      return add_money_view;
}


