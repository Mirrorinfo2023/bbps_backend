// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class notificationAppType extends Model {
      
      static async getAllData() {
        try {
          const result = await this.findAll({
              where: {
                status: 1,
              },
              order: [['created_on', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    }

    notificationAppType.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
       
        app_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
       
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
      
       
  
      },
      {
        sequelize, 
        modelName: 'notificationAppType',
        tableName: 'mst_notification_app', // specify table name here
        timestamps: false
      });
      
      return notificationAppType;
}


