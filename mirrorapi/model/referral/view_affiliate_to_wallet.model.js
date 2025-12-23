const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class view_affilateToWallet extends Model {
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
              where: whereCondition,
              order: [['created_on', 'DESC']],
               limit: 10, 
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }

    view_affilateToWallet.init({
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
              type: DataTypes.DOUBLE,
              allowNull: false
          },
          deduction_amt: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        transfer_amt: {
          type: DataTypes.DOUBLE,
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
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.INTEGER,
            allowNull: false,   
        },
        tranfer_date:{
            type: DataTypes.STRING,
            allowNull: false, 
        }
   
          
      },
      {
        sequelize, 
        modelName: 'view_affilateToWallet',
        tableName: 'view_affiliate_to_wallet', // specify table name here
        timestamps: false
      });
      
      return view_affilateToWallet;
}


