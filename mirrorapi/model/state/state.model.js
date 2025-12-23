// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class state extends Model {}

    state.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false
        },
        country_id: {
        type: DataTypes.INTEGER,
        allowNull: false
        },
        country_code: {
        type: DataTypes.STRING,
        allowNull: false
        },
        status: {
        type: DataTypes.INTEGER,
        allowNull: false
        }
        
  
      },
      {
        sequelize, 
        modelName: 'state',
        tableName: 'mst_states', // specify table name here
        timestamps: false
      });
      
      return state;
}


