// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class notificationCategory extends Model {
      
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

    notificationCategory.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
       
          notification_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
       
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
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
       
       
  
      },
      {
        sequelize, 
        modelName: 'notificationCategory',
        tableName: 'mst_notification_type', // specify table name here
        timestamps: false
      });
      
      return notificationCategory;
}


