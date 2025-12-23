// Define the affiliate model
module.exports = (sequelize, DataTypes, Model) => {

    class Pincode extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(pincode) {
        try {
          const result = await this.findAll({
            where: {pincode: pincode}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
    }
    Pincode.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        circle:{
            type: DataTypes.STRING,
            allowNull: true
        },
        region:{
            type: DataTypes.STRING,
            allowNull: true
        },
        division:{
            type: DataTypes.STRING,
            allowNull: true
        },
        office_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        pincode:{
            type: DataTypes.STRING,
            allowNull: true
        },
        district:{
            type: DataTypes.STRING,
            allowNull: true
        },
        state_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude:{
            type: DataTypes.STRING,
            allowNull: true
        },
        longitude:{
            type: DataTypes.STRING,
            allowNull: true
        },
      },
      {
        sequelize, 
        modelName: 'pincode',
        tableName: 'mst_pincode', // specify table name here
        timestamps: false
      });
      
      return Pincode;
}


