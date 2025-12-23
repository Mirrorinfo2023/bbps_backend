// Define the affiliate model
const { Sequelize, Model, DataTypes, Op, sequelize ,literal } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class RecentAppUse extends Model {
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
    
        static async getCount(user_id,today) {
        try {
          const result = await this.count({
             where: Sequelize.literal(`CAST(created_on AS DATE) = '${today}' AND user_id = '${user_id}'`),
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
    }
    RecentAppUse.init({
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
        title:{
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url:{
            type: DataTypes.STRING,
            allowNull: false
        },
        functions:{
            type: DataTypes.TEXT,
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
        modelName: 'RecentAppUse',
        tableName: 'log_recent_app_use', // specify table name here
        timestamps: false
      });
      
      return RecentAppUse;
}


