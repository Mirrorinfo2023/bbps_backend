// Define the Cashback model
module.exports = (sequelize, DataTypes, Model) => {

    class Cashback extends Model {
      static async insert(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
     
      static async getCashbackAmount(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            tran_for: 'cashback'
          }
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            tran_for: 'cashback'
          }
        });
    
        let cr_amount=0;
        let dr_amount =0;
        
         if(credit_amount && credit_amount.dataValues.amount !== null 
        && credit_amount.dataValues.amount>=0){
            
            cr_amount = credit_amount.dataValues.amount;
        }
        
        if(debit_amount && debit_amount.dataValues.amount !== null 
        && debit_amount.dataValues.amount>=0){
            
            dr_amount = debit_amount.dataValues.amount;
        }
        return cr_amount - dr_amount;
      }
      
    }
    Cashback.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction_id: {
              type: DataTypes.INTEGER,
              allowNull: false
              },
        env: {
              type: DataTypes.STRING,
              allowNull: false
          },
        type: {
              type: DataTypes.STRING,
              allowNull: false
          },
        sub_type: {
              type: DataTypes.STRING,
              allowNull: false
          },
          for: {
            type: DataTypes.STRING,
            allowNull: false
        },
        opening_balance: {
              type: DataTypes.DOUBLE,
              allowNull: true
          },
        credit: {
          type: DataTypes.DOUBLE,
          allowNull: false
          },
        debit: {
          type: DataTypes.DOUBLE,
          allowNull: true
          },
        closing_balance: {
          type: DataTypes.DOUBLE,
          allowNull: true
          },
        tran_for:{
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        project_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        created_by: {
        type: DataTypes.INTEGER,
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
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        is_cashfree: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'cashback',
        tableName: 'tbl_cashback', // specify table name here
        timestamps: false
      });
      
      return Cashback;
}


