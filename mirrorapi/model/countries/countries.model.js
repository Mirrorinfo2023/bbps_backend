// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class countries extends Model {}

    countries.init({
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
           flag: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
          capital: {
          type: DataTypes.STRING,
          allowNull: false
          },
           timezones: {
          type: DataTypes.STRING,
          allowNull: false
          }
        
  
      },
      {
        sequelize, 
        modelName: 'countries',
        tableName: 'mst_countries', // specify table name here
        timestamps: false
      });
      
      return countries;
}


