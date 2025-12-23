// Define the affiliate model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class todays_notification_content extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(attribute, whereClause) {
        try {
          const fixedCondition = { status: 1 };
          const result = await this.findAll({
            attributes: [...attribute, [Sequelize.fn('MAX', Sequelize.col('created_on')), 'max_created_on']],
            where: { ...fixedCondition, ...whereClause },
            group: [...attribute],
            order: [['max_created_on', 'DESC']],
            limit: 8
          });
      
      
          return result;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }

      
    }
    todays_notification_content.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        body:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
      },
      {
        sequelize, 
        modelName: 'todays_notification_content',
        tableName: 'tbl_todays_notification_content', // specify table name here
        timestamps: false
      });
      
      return todays_notification_content;
}


