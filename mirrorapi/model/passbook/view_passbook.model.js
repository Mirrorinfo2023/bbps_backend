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
        transaction_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_on: {
            type: DataTypes.STRING,
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
          mlm_id: {
              type: DataTypes.STRING,
              allowNull: true
          },
          first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        consumer_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        main_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        recharge_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        recharge_type: {
            type: DataTypes.STRING,
            allowNull: true
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
        trax_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        operator: {
            type: DataTypes.STRING,
            allowNull: true
        },
        operator_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        panel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true
        },
        plan_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        plan_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        prime_rate: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        from_user_fname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        from_user_lname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        from_user_mlm_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        from_user_mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_user_fname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_user_lname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_user_mlm_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        to_user_mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        reference_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        recharge_status: {
            type: DataTypes.STRING,
            allowNull: true
        }

        
  
      },
      {
        sequelize, 
        modelName: 'passbook',
        tableName: 'view_passbook', // specify table name here
        timestamps: false
      });
      
      return passbook;
}


