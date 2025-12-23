// Define the Prime model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class Prime extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getLastclosingBalance(user_id)
      {
          

           try {
                const closingBalance = await this.findOne({
                            attributes: ['closing_balance'],
                            where:{
                                user_id:user_id,
                                status:'1',
                            },
                            order: [['id', 'DESC']],
                            raw: true,
                            nest:true
                          });
        
                // If closingBalance is null or undefined, return zero
                return closingBalance ? closingBalance.closing_balance : 0;
            } catch (error) {
                console.error('Error in getLastclosingBalance:', error);
                throw error; 
            }
      }
      
      static async getPrimeAmount(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
          }
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1'
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
      
      
      
    static async insert_prime_wallet(transactionData)
    {
        
        
        const wallet = await this.findOne({
            where: {
                user_id: transactionData.user_id,
                env: transactionData.env,
                status: 1,
            },
            order: [['id', 'DESC']],
            limit: 1,
        });

        const opening_balance = wallet ? wallet.closing_balance : 0;
        let credit = 0;
        let debit = 0;
        let closing_balance = 0;

        if (transactionData.type === 'Credit') {
            credit = transactionData.amount;
            closing_balance = parseFloat(opening_balance) + parseFloat(credit);
        }

        if (transactionData.type === 'Debit') {
            debit = transactionData.amount;
            closing_balance = parseFloat(opening_balance) - parseFloat(debit);
        }


        try {
            const newTransaction = await this.create({
                user_id: transactionData.user_id,
                transaction_id: transactionData.transaction_id,
                env: transactionData.env,
                type: transactionData.type,
                sub_type: transactionData.sub_type,
                tran_for: transactionData.tran_for,
                opening_balance,
                credit,
                debit,
                closing_balance,
                status: 1,
                created_by: transactionData.user_id,
                description: transactionData.description?transactionData.description:transactionData.sub_type
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
       
       static async hasUsedPrimeWallet(userId, tran_for) {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      
        const usageCount = await this.count({
          where: {
            user_id: userId,
            tran_for,
            created_on: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        });
      
        return usageCount > 0;
      }
      
    }
    Prime.init({
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
              allowNull: true
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
        is_used: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'primeWallet',
        tableName: 'tbl_prime_wallet', // specify table name here
        timestamps: false
      });
      
      return Prime;
}


