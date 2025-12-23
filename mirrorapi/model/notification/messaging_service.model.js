// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class messagingService extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      static async getAllData(whereClause) {
        try {
          const result = await this.findAll({
              where: {
                ...whereClause
              },
              order: [['id', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }
  
    messagingService.init({
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        user_id : {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        service : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message_id : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        transaction_id : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount : {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        invoice_no : {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        invoice_date : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        getway : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        bank_ref_no : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tracking_id : {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        payment_date : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        gateway_order_id : {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_on : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status : {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        msg_notification: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        msg_whatsup: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        msg_email: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        msg_sms: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        whatsup_response: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        email_response: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sms_response: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
  
      },
      {
        sequelize, 
        modelName: 'messagingService',
        tableName: 'trans_service_messaging', // specify table name here
        timestamps: false
      });
      
      return messagingService;
  }
  
  
  