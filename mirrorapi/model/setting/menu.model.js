// Define the affiliate model
module.exports = (sequelize, DataTypes, Model) => {

    class Menu extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(whereClause) {
        try {
          const result = await this.findOne({
            where: {...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getAllData(whereClause) {
        try {
          const result = await this.findAll({
            where: {...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
    }
    Menu.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        menu_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        parent_id:{
          type: DataTypes.BIGINT,
          allowNull: false
        },
        menu_url:{
          type: DataTypes.STRING,
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
          type: DataTypes.BIGINT,
          allowNull: true
        },

      },
      {
        sequelize, 
        modelName: 'Menu',
        tableName: 'mst_menu', // specify table name here
        timestamps: false
      });
      
      return Menu;
}


