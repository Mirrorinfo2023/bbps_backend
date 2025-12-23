// Define the Cashback model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
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
            env: 'PROD'
          }
        });
    
        const debit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('debit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            env: 'PROD'
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
      
      
      static async getCashbackTotalAmount(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            env: 'PROD'
          }
        });
    
    
        let cr_amount=0;
        
         if(credit_amount && credit_amount.dataValues.amount !== null 
        && credit_amount.dataValues.amount>=0){
            
            cr_amount = credit_amount.dataValues.amount;
        }
        
        return cr_amount;
      }

      static async getLastclosingBalance(user_id)
      {
          const closingBalance = await this.findOne({
            attributes: ['closing_balance'],
            where:{
                user_id:user_id,
                status:'1',
                env: 'PROD'
            },
            order: [['id', 'DESC']],
            raw: true,
            nest:true
          });
          return closingBalance?closingBalance.closing_balance:0;
      }
      
      
      
    static async insert_cashback_wallet(transactionData)
    {
        
        
        const wallet = await this.findOne({
            attributes: ['closing_balance'],
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
                closing_balance:closing_balance,
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
       
       static async getAllData(attribute, whereClause) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findAll({
            attributes: [...attribute, 
              [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y'), 'created_on'] 
            ],
            where: {...fixedCondition, ...whereClause},
            order: [['created_on', 'DESC']]
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
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
        is_cashfree: {
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
        modelName: 'cashback',
        tableName: 'tbl_cashback_wallet', // specify table name here
        timestamps: false
      });
      
      return Cashback;
}


