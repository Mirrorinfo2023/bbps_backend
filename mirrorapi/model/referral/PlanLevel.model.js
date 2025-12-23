const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class PlanLevel extends Model {
        
         static async getPlanAmount(attribute, whereClause) {
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

    PlanLevel.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
         amount:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        plan:{
            type: DataTypes.STRING,
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
          },
     percentage:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
        
  
      },
      {
        sequelize, 
        modelName: 'PlanLevel',
        tableName: 'mst_plan_level_amount', // specify table name here
        timestamps: false,
       
        
      });
      
      return PlanLevel;
}


