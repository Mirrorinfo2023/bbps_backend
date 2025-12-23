// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class cashBackReport extends Model {

    }


    cashBackReport.init({
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
          ConsumerNumber:{
              type: DataTypes.STRING,
              allowNull: false
          },
          main_amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
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
        reference_no:{
            type: DataTypes.STRING,
            allowNull: true
        },
        cashback_point: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        bonus_point: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        group_transaction_no:{
            type: DataTypes.STRING,
            allowNull: true
        },
        ip_address:{
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
     }, {
        sequelize, 
        modelName: 'cashBackReport',
        tableName: 'view_cashback_wallet', // specify table name here
        timestamps: false
      });
      
      return cashBackReport;
}


