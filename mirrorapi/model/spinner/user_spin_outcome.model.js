// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class userSpin extends Model {
        static async insert(data){
            try {
                const result = await this.create(data);
                  return result;
              } catch (error) {
                  console.error('Error:', error);
                  throw error;
              }
        }
        static async getData(user_id, spinner_id, spin_outcome)
        {
            try {
                const result = await this.findOne({
                    where: {
                        user_id: user_id,
                        spinner_id:spinner_id,
                        spin_outcome:spin_outcome,
                        status: '1',
                    },
                    order: [['id', 'DESC']],
                });
        
                return result;
            } catch (error) {
                console.error('Error in getLastclosingBalance:', error);
                throw error; 
            }
        }
        
        static async getAllData(user_id)
        {
            try {
                const result = await this.findAll({
                    where: {
                        user_id: user_id,
                        status: '1',
                    },
                    order: [['id', 'DESC']],
                });
        
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error; 
            }
        }
        
        static async getUserCashback(user_id)
        {
            try {
                const results = await this.findAll({
                    attributes: ['user_id',
                    [sequelize.fn('SUM', sequelize.col('cashback_amount')), 'amount']
                ],
                    where: {
                        cashback_type: {
                            [Op.like]: '%Wallet%'
                          },
                        status: '1',
                    }, 
                    order: [[this.sequelize.literal('MAX(id)'), 'DESC']],
                    group: ['user_id'],
                    limit: 10,
                });
        
                return results;
            } catch (error) {
                console.error('Error in getLastclosingBalance:', error);
                throw error; 
            }
        }
        
        static async getLastData(user_id)
        {
            try {
                const result = await this.findOne({
                    where: {
                        user_id: user_id,
                        status: '1',
                    },
                    order: [['id', 'DESC']],
                });
        
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error; 
            }
        }
    }

    userSpin.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        spinner_id: {
              type: DataTypes.STRING,
              allowNull: true
        },
        spin_date: {
              type: DataTypes.DATE,
              allowNull: false
        },
        spin_outcome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        main_amount: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        cashback_amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
          },
        
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        
        attempt: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cashback_type: {
            type: DataTypes.STRING,
            allowNull: true
        }
       
  
      },
      {
        sequelize, 
        modelName: 'userSpin',
        tableName: 'tbl_user_spinner_outcome', // specify table name here
        timestamps: false
      });
      
      return userSpin;
}


