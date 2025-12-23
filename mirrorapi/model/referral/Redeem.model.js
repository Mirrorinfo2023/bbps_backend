const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class Redeem extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getCount(trans_no) {
        try {
          const result = await this.count({
            where: {trans_no}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getTransactionAmount(trans_no,amount,user_id) {
        try {
          const result = await this.count({
            where: {trans_no,amount,user_id}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async chkRedeem(user_id,amount,todayStartDate ,todayEndDate) {
            try {
              const result = await this.count({
                where: {'user_id':user_id,
                        'amount':amount,
                        'created_on': {
                              [Op.between]: [todayStartDate, todayEndDate]
                          },}
              });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
      }
      
     

      
      static async UpdateData(data,user_id,trans_no) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: { user_id: user_id,trans_no:trans_no }
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
       static async getAllData(whereCondition) {
        try {
          const result = await this.findAll({
            attributes: [
              'id',
              'user_id',
              'amount',
              'category',
              'remarks',
              'trans_no',
              'approval_remarks',
              'updated_by' ,
              'status',
              'created_on',
              [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'redeem_date'],
              
            ],
              where: whereCondition,
              order: [['status', 'ASC'],['id', 'DESC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getRedeemData(whereCondition) {
        try {
          const result = await this.findAll({
            attributes: [
              'id',
              'user_id',
              'amount',
              'category',
              'remarks',
              'trans_no',
              'approval_remarks',
              'updated_by' ,
              'status',
              'created_on',
              [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'redeem_date'],
              
            ],
              where: whereCondition,
              order: [['created_on', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getAllRedeemAmount(whereClause) {
        try {
          const redeem = await this.findOne({
            attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'amount']],
            where: {
              ...whereClause
            }
          });
          let totalRedeem = 0;
          if(redeem && redeem.dataValues.amount !== null && redeem.dataValues.amount>=0)
          {
            totalRedeem = redeem.dataValues.amount;
          }
          return totalRedeem;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }



    }

    Redeem.init({
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
        remarks: {
          type: DataTypes.STRING,
          allowNull: true
          },
        approval_remarks: {
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
          }
          
          
          
          
        
  
      },
      {
        sequelize, 
        modelName: 'Redeem',
        tableName: 'trans_redeem_request', // specify table name here
        timestamps: false
      });
      
      return Redeem;
}


