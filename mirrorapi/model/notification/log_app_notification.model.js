// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class log_app_notification extends Model {
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
                status: 0,
              },
              order: [['entry_datetime', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async UpdateData(data , whereClause) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: whereClause
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    
    }

    log_app_notification.init({
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
        tokens: {
              type: DataTypes.TEXT,
              allowNull: false
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        entry_datetime: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
        },
        update_datetime: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
         category: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
       app_id: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
     
     
       
  
      },
      {
        sequelize, 
        modelName: 'log_app_notification',
        tableName: 'log_app_notifications', // specify table name here
        timestamps: false
      });
      
      return log_app_notification;
}


