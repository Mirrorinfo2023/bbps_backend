// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class whatsapp_notification extends Model {
      
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

    whatsapp_notification.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        mobile:{
          type: DataTypes.STRING,
          allowNull: false
        },
        
        message: {
              type: DataTypes.TEXT,
              allowNull: false
        },
      
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        
        entry_datetime: {
          type: DataTypes.DATE,
          allowNull: true
          
        },

        updated_datetime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        transaction_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        service: {
          type: DataTypes.STRING,
          allowNull: true
        }
     
       
  
      },
      {
        sequelize, 
        modelName: 'whatsapp_notification',
        tableName: 'log_whatsapp_notification', // specify table name here
        timestamps: false
      });
      
      return whatsapp_notification;
}


