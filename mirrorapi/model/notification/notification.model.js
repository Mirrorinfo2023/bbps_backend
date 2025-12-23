// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class notification extends Model {
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
     static async getAllRecords(whereClause) {
        try {
          const result = await this.findAll({
              where: whereClause,
              order: [['created_on', 'ASC']],
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

    notification.init({
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
         link: {
          type: DataTypes.STRING,
          allowNull: true
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
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
        },
        modified_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
     
       
  
      },
      {
        sequelize, 
        modelName: 'notification',
        tableName: 'tbl_fcm_notification', // specify table name here
        timestamps: false
      });
      
      return notification;
}


