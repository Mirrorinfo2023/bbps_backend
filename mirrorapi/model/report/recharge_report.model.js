// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class rechargeReport extends Model {

    }

    rechargeReport.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          ConsumerNumber:{
              type: DataTypes.STRING,
              allowNull: false
          },
          operatorId: {
                type: DataTypes.INTEGER,
                allowNull: false
                },
          amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
          type: {
                type: DataTypes.STRING,
                allowNull: false
            },
          env: {
                type: DataTypes.STRING,
                allowNull: false
            },
          main_amount: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
          service_rate: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          service_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          cashback_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
            },
          cashback_rate:{
              type: DataTypes.DOUBLE,
              allowNull: false
          },
          recharge_status:{
              type: DataTypes.STRING,
              allowNull: true
          },
          user_id:{
              type: DataTypes.INTEGER,
              allowNull: false
          },
          recharge_date: {
            type: DataTypes.STRING,
            allowNull: false
          },
          created_on: {
            type: DataTypes.DATE,
            allowNull: true
            },
          updated_on: {
            type: DataTypes.DATE,
            allowNull: true
            },
          updated_by: {
            type: DataTypes.INTEGER,
            allowNull: true
            },
          transaction_id: {
            type: DataTypes.STRING,
            allowNull: false
          },
          http_code: {
            type: DataTypes.STRING,
            allowNull: true
          }, 
          response_code: {
            type: DataTypes.STRING,
            allowNull: true
          },   
          message: {
            type: DataTypes.TEXT,
            allowNull: true
          },   
          description: {
            type: DataTypes.TEXT,
            allowNull: true
          },   
          status: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          trax_id: {
            type: DataTypes.STRING,
            allowNull: true
          },
          panel_id: {
            type: DataTypes.INTEGER,
            allowNull: true
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ip_address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            operator_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            service_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            operator_image:{
                type: DataTypes.STRING,
                allowNull: false
            },
            reference_no:{
                type: DataTypes.STRING,
                allowNull: true
            },
     }, {
        sequelize, 
        modelName: 'rechargeReport',
        tableName: 'view_recharge', // specify table name here
        timestamps: false
      });
      
      return rechargeReport;
}


