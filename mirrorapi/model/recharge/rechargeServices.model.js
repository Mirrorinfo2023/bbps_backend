// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class rechargeServices extends Model {}

    rechargeServices.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        service_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        service_url: {
              type: DataTypes.STRING,
              allowNull: false
              },
        callback_url: {
              type: DataTypes.STRING,
              allowNull: false
          },
        status_code: {
              type: DataTypes.TEXT,
              allowNull: true
          },
        error_message: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true
          },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        modified_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'rechargeServices',
        tableName: 'mst_recharge_services', // specify table name here
        timestamps: false
      });
      
      return rechargeServices;
}


