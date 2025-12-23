// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class city extends Model {}

    city.init({
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
           state_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
           state_code: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
           country_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
           country_code: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
          flag: {
          type: DataTypes.INTEGER,
          allowNull: false
          }
        
  
      },
      {
        sequelize, 
        modelName: 'city',
        tableName: 'mst_cities', // specify table name here
        timestamps: false
      });
      
      return city;
}


