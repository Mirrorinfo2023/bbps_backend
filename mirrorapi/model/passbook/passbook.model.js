// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class passbook extends Model {
 
        static async insert_passbook(transactionData)
        {
            
            const passbook = await this.findOne({
                where: {
                    user_id: transactionData.user_id,
                    env: transactionData.env,
                    status: 1,
                },
                order: [['id', 'DESC']],
                limit: 1,
            });

            const opening_balance = passbook ? passbook.closing_balance : 0;
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
                    tran_for: transactionData.tran_for,
                    opening_balance,
                    credit,
                    debit,
                    closing_balance,
                    status: 1,
                    created_by: transactionData.user_id,
                    ref_tbl_id:transactionData.ref_tbl_id
                });
                    if (newTransaction) {
                        
                            const createdId = newTransaction.id;
                            
                            return { error: 0, message: 'Transaction saved', createdId:createdId };
                            
                        } else {
                            return { error: 1, message: 'Unable to save transaction' };
                        }
            
            
                } catch (error) {
                    console.error('Error inserting into the passbook:', error.message);
                    throw error;
                }

            
            
        }
      

    }

    passbook.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        ref_tbl_id:{
            type: DataTypes.INTEGER,
            allowNull: false
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
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
        
  
      },
      {
        sequelize, 
        modelName: 'passbook',
        tableName: 'tbl_passbook', // specify table name here
        timestamps: false
      });
      
      return passbook;
}


