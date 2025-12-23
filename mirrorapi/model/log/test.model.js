const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class test extends Model {
       static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    }

    test.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
	   name: {
          type: DataTypes.STRING,
          allowNull: true
      },
      dob: {
          type: DataTypes.DATE,
          allowNull: true
      },
	  country_id: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
	  state_id: {
          type: DataTypes.INTEGER,
          allowNull: true
      },
	   remarks: {
          type: DataTypes.STRING,
          allowNull: true
      }
       
      
      
      
	
	
	
  
      }, {
        sequelize, 
        modelName: 'temp_test',
        tableName: 'temp_test', // specify table name here
        timestamps: false
      });
      
      return test;
}