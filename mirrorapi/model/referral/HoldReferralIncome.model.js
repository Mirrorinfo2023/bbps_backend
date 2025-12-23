// Define the ReferralIncome model
module.exports = (sequelize, DataTypes, Model) => {

    class HoldReferralIncome extends Model {
        
        
      static async insert(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getDataForCreditIncome() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        try {
          const result = await this.findAll({
            where: {
                created_on: {
                  [Op.gt]: sevenDaysAgo,
                  [Op.lt]: startOfToday
                }
              }
          });
          
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
       
      
      static async getEarningAmount(whereCondition) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('amount')), 'amount']
          ],
          where: whereCondition
        });
        return credit_amount.dataValues.amount;
      }
        
        
        
    static async insert_income(transactionData)
    {

        try {
            const newTransaction = await this.create({
                user_id: transactionData.user_id,
                transaction_id: transactionData.transaction_id,
                env: transactionData.env,
                type: transactionData.type,
                sub_type: transactionData.sub_type,
                tran_for: transactionData.tran_for,
                amount:transactionData.amount,
                details:transactionData.details,
                sender_id:transactionData.sender_id,
                level:transactionData.level,
                status: 1,
                created_by: transactionData.user_id,
                shopping_order_id: transactionData.shopping_order_id
            });
                if (newTransaction) {
                    
                        const createdId = newTransaction.id;
                        
                        return { error: 0, message: 'Transaction saved', createdId:createdId };
                        
                    } else {
                        return { error: 1, message: 'Unable to save transaction' };
                    }
        
        
            } catch (error) {
                console.error('Error inserting into the wallet:', error.message);
                throw error;
            }

        
       }
      

    }

    HoldReferralIncome.init({
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
              type: DataTypes.BIGINT,
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
              allowNull: true
          },
        amount: {
              type: DataTypes.DOUBLE,
              allowNull: false
          },
        tran_for:{
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
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
        details:{
            type: DataTypes.STRING,
            allowNull: false
        },
        sender_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
         level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        shopping_order_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'HoldReferralIncome',
        tableName: 'tbl_hold_referral_income', // specify table name here
        timestamps: false
      });
      
      return HoldReferralIncome;
}


