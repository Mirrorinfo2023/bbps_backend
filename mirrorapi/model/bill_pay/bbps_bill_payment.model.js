// Define the BBPS bill fetch model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class BbpsBillerPayment extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getAllData() {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findAll({
            where: {...fixedCondition}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(whereParam) {
        try {
          const result = await this.findOne({
            where: {...whereParam},
            order: [['id', 'DESC']],

          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async updateData(data, whereClause) {
        try {
            const updateRecharge = await this.update(data, {
                where: whereClause
            });
            if(updateRecharge){
                return { error: 0, message: 'Updated', result:updateRecharge.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getTransactionForMonth(user_id, from_date, upto_date) {

        const result = await this.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
            where: {
                user_id: user_id,
                status: 1,
                created_on: {
                    [Op.between]: [from_date, upto_date]
                }
            },
            order: [['id', 'DESC']]
        });

        return result ? result.dataValues.num: 0;
      }
      
      static async getTotalBillPaymentCount() {

        const result = await this.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
            where: {
                status: 1,
            },
            order: [['id', 'DESC']]
        });

        return result ? result.dataValues.num: 0;
      }

      static async getTotalBillPayment() {

        const result = await this.findOne({
            attributes: [[sequelize.fn('SUM', sequelize.col('main_amount')), 'amount']],
            where: {
                status: 1,
            },
            order: [['id', 'DESC']]
        });

        let billAmount = 0;

        if(result && result.dataValues.amount !== null 
          && result.dataValues.amount>=0){
              
            billAmount = result.dataValues.amount;
          }

        return billAmount;
      }
      
      
      static async getTodayBillSucess() {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
        
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
        
            const bbpsCount = await this.findOne({
                attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
                where: {
                    created_on: {
                        [Op.between]: [todayStart, todayEnd]
                    },
                    payment_status: 'SUCCESS'
                }
            });
        
            return bbpsCount?.dataValues.num || 0;
        }
        
        static async getLast15DaysBBPSCount(whereClause) {
          try {
            const userCount = await this.count({
              where: {
                ...whereClause
              }
            });
            return userCount;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }
    
        static async getTodayBillFail() {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0); 
      
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999);
      
          const bbpsCount = await this.findOne({
              attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
              where: {
                  created_on: {
                      [Op.between]: [todayStart, todayEnd]
                  },
                  payment_status: 'FAILURE'
              }
          });
      
          return bbpsCount?.dataValues.num || 0;
      }
      
      static async getTodayBillHold() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); 
    
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); 
    
        const bbpsCount = await this.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
            where: {
                created_on: {
                    [Op.between]: [todayStart, todayEnd]
                },
                payment_status: 'HOLD'
            }
        });
    
        return bbpsCount?.dataValues.num || 0;
    }

    
    }

    BbpsBillerPayment.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        consumer_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        biller_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
              type: DataTypes.DOUBLE,
              allowNull: false
              },
        env: {
              type: DataTypes.STRING,
              allowNull: false
          },
        main_amount: {
              type: DataTypes.DOUBLE,
              allowNull: false
        },
        service_rate: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        service_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        cashback_amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        cashback_rate: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        payment_status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        http_code: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        response_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }, 
        status: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        resp_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        }, 
        bill_no: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        bill_date: {
            type: DataTypes.DATE,
            allowNull: true
        }, 
        bill_preriod: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        bill_due_date: {
            type: DataTypes.DATE,
            allowNull: true
        }, 
        input_params: {
            type: DataTypes.TEXT,
            allowNull: false
        }, 
        trax_id: {
            type: DataTypes.STRING,
            allowNull: true
        }, 
        cust_conv_fee: {
            type: DataTypes.DOUBLE,
            allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'BbpsBillerPayment',
        tableName: 'tbl_bbps_bill_payment', // specify table name here
        timestamps: false
      });
      
      return BbpsBillerPayment;
}


