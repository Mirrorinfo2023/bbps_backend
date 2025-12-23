// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class logSystemCreditDebit extends Model {
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
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }

    logSystemCreditDebit.init({
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

        wallet_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transaction_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: false
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
        modelName: 'logSystemCreditDebit',
        tableName: 'log_system_credit_debit', // specify table name here
        timestamps: false
      });
      
      return logSystemCreditDebit;
}


