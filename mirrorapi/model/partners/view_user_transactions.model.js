// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class viewUserTransaction extends Model {
        
        
      static async insert(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getWalletAmount(user_id) {
        const credit_amount = await this.findOne({
          attributes: [
            [sequelize.fn('SUM', sequelize.col('credit')), 'amount']
          ],
          where: {
            user_id: user_id,
            status: '1',
            tran_for: 'main',
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
            tran_for: 'main',
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
        
         let wallet_balance = cr_amount-dr_amount;
        return (wallet_balance>0)?wallet_balance:0;
      }
      

      static async getLastclosingBalance(user_id)
      {
           try {
                const closingBalance = await this.findOne({
                    attributes: ['closing_balance'],
                    where: {
                        user_id: user_id,
                        status: '1',
                        tran_for: 'main',
                        env: 'PROD'
                    },
                    order: [['id', 'DESC']],
                    raw: true,
                    nest: true
                });
        
                // If closingBalance is null or undefined, return zero
                return closingBalance ? closingBalance.closing_balance : 0;
            } catch (error) {
                console.error('Error in getLastclosingBalance:', error);
                throw error; 
            }
      }
        
        
    static async insert_wallet(transactionData)
    {
        
        
        const wallet = await this.findOne({
            where: {
                user_id: transactionData.user_id,
                env: transactionData.env,
                tran_for: 'main',
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
      

    }

    viewUserTransaction.init({
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
        type: {
              type: DataTypes.STRING,
              allowNull: false
        },
        sub_type: {
              type: DataTypes.STRING,
              allowNull: true
        },
        opening_balance: {
              type: DataTypes.DOUBLE,
              allowNull: false
        },
        credit: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        debit: {
          type: DataTypes.DOUBLE,
          allowNull: false
        },
        closing_balance: {
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
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transaction_date: {
            type: DataTypes.DATE,
          allowNull: true
        },
        company_code : {
            type: DataTypes.STRING,
            allowNull: true
        },
        name : {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile : {
            type: DataTypes.STRING,
            allowNull: true
        },
        email : {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference_no : {
            type: DataTypes.STRING,
            allowNull: true
        },
        group_transaction_no : {
            type: DataTypes.STRING,
            allowNull: true
        },
        trans_for : {
            type: DataTypes.STRING,
            allowNull: true
        },
        tran_type : {
            type: DataTypes.STRING,
            allowNull: true
        },
        tran_sub_type : {
            type: DataTypes.STRING,
            allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'viewUserTransaction',
        tableName: 'view_user_transactions', // specify table name here
        timestamps: false
      });
      
      return viewUserTransaction;
}


