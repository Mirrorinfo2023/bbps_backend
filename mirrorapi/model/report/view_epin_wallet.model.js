// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class ViewEpinWallet extends Model {
    

    }

    ViewEpinWallet.init({
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
          deleted_by: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
          mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
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
                unique:true
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique:true
            },
            category:{
                type: DataTypes.STRING,
                allowNull: false
            },
            reference_no:{
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
                type: DataTypes.TEXT,
                allowNull: true
            },
            from_user_lname: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            from_user_mlm_id: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            from_user_mobile: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            to_user_fname: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            to_user_lname: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            to_user_mlm_id: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            to_user_mobile: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            discription: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            
     }, {
        sequelize, 
        modelName: 'ViewEpinWallet',
        tableName: 'view_epinwallet', // specify table name here
        timestamps: false
      });
      
      return ViewEpinWallet;
}


