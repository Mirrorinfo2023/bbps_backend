// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class fcm_notification extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      static async getAllData() {
        try {
          const result = await this.findAll({
              where: {
                status: 1,
              },
              order: [['operator_name', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
       static async getFcmTokenByAppId(userId,appId) {
        try {
          const result = await this.findOne({
              where: {
                user_id:userId,
                app_id: appId,
              },
              order: [['created_on', 'DESC']],
              // limit:1
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
        static async getFcmToken(userId) {
        try {
          const result = await this.findOne({
              where: {
                user_id:userId,
              },
              order: [['created_on', 'DESC']],
              // limit:1
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
    }

    fcm_notification.init({
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
        token: {
              type: DataTypes.TEXT,
              allowNull: false
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
           app_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        app_id: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
     
     
       
  
      },
      {
        sequelize, 
        modelName: 'fcm_notification',
        tableName: 'log_user_notification_token_details_hub', // specify table name here
        timestamps: false
      });
      
      return fcm_notification;
}


