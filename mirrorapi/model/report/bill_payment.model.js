// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class billPaymentReport extends Model {

    }

    billPaymentReport.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          consumer_name:{
              type: DataTypes.STRING,
              allowNull: true
          },
          biller_id:{
              type: DataTypes.STRING,
              allowNull: false
          },
          amount: {
                type: DataTypes.DOUBLE,
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
          payment_status: {
            type: DataTypes.STRING,
            allowNull: true
          },
          user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
          },
          transaction_id: {
              type: DataTypes.STRING,
              allowNull: true
          },
          http_code: {
              type: DataTypes.STRING,
              allowNull: true
          }, 
          response_code: {
              type: DataTypes.STRING,
              allowNull: true
          },
          description: {
              type: DataTypes.TEXT,
              allowNull: true
          }, 
          status: {
              type: DataTypes.STRING,
              allowNull: true
          }, 
          resp_amount: {
              type: DataTypes.DOUBLE,
              allowNull: false
          }, 
          bill_no: {
              type: DataTypes.STRING,
              allowNull: false
          }, 
          bill_date: {
              type: DataTypes.DATE,
              allowNull: false
          }, 
          bill_preriod: {
              type: DataTypes.STRING,
              allowNull: true
          }, 
          bill_due_date: {
              type: DataTypes.DATE,
              allowNull: true
          }, 
          input_params: {
              type: DataTypes.TEXT,
              allowNull: false
          }, 
          trax_id: {
              type: DataTypes.STRING,
              allowNull: false
          }, 
          cust_conv_fee: {
              type: DataTypes.DOUBLE,
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
            reference_no:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            billpayment_date: {
                type: DataTypes.STRING,
                allowNull: true
            },
            operator_name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            bill_amount: {
                type: DataTypes.STRING,
                allowNull: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: true
            },
            operator_image:{
                type: DataTypes.STRING,
                allowNull: true
            }
            
     }, {
        sequelize, 
        modelName: 'billPaymentReport',
        tableName: 'view_bill_payment', // specify table name here
        timestamps: false
      });
      
      return billPaymentReport;
}


