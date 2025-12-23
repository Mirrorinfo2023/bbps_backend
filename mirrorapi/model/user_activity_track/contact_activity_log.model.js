// Define the affiliate model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ContactActivityTrack extends Model {
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
    ContactActivityTrack.init({
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
        mobile:{
            type: DataTypes.STRING,
            allowNull: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        type:{
          type: DataTypes.STRING,
          allowNull: true
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
        data_details: {
          type: DataTypes.TEXT,
          allowNull: true
        },
      
      },
      {
        sequelize, 
        modelName: 'ContactActivityTrack',
        tableName: 'log_user_contacts_details', // specify table name here
        timestamps: false
      });
      
      return ContactActivityTrack;
}


