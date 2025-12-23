// Define the model
module.exports = (sequelize, DataTypes, Model) => {

    class notification_view extends Model {
     //attribute,
      static async getData(whereClause) {
        try {
          const result = await this.findAll({
            // attributes: attribute,
            where: whereClause
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    }

    notification_view.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
                primaryKey: true,
                autoIncrement: true
          },
          app_id:{
            type: DataTypes.INTEGER,
            allowNull: false
          },
          type_id:{
              type: DataTypes.INTEGER,
              allowNull: false
            },
          title:{
              type: DataTypes.STRING,
              allowNull: false
          },
          body: {
                type: DataTypes.TEXT,
                allowNull: false
          },
          image: {
            type: DataTypes.TEXT,
            allowNull: true
           },
          status: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
          created_on: {
            type: DataTypes.DATE,
            allowNull: true,
           
          },
          created_by: {
              type: DataTypes.INTEGER,
              allowNull: true
          },
          modified_on: {
            type: DataTypes.DATE,
            allowNull: true,
            
          },
          modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
          },

          app_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        notification_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        notification_date:{
          type: DataTypes.STRING,
          allowNull: false
         },
        
  
    },
    {
        sequelize, 
        modelName: 'notification_view',
        tableName: 'view_notification', // specify table name here
        timestamps: false
    });
      
    return notification_view;
}


