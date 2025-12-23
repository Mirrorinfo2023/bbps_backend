const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class SchemeLevel extends Model {
        
        static async getSchemePercentage(attribute, whereClause) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...fixedCondition, ...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    

   

    }

    SchemeLevel.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        percentage:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        
        shopping_percentage:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        package_percentage:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        level:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          }
        
  
      },
      {
        sequelize, 
        modelName: 'SchemeLevel',
        tableName: 'mst_scheme_level_precentage', // specify table name here
        timestamps: false,
       
        
      });
      
      return SchemeLevel;
}


