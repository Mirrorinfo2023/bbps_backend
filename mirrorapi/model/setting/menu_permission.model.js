// Define the menu model
module.exports = (sequelize, DataTypes, Model) => {

    class MenuPermission extends Model {
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
    MenuPermission.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        employee_id:{
            type: DataTypes.BIGINT,
            allowNull: true
        },
        menu_id:{
            type: DataTypes.BIGINT,
            allowNull: true
        },
        page_url:{
          type: DataTypes.STRING,
          allowNull: false
        },
        _list:{
          type: DataTypes.INTEGER,
          allowNull: true
        },
        _insert:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        _view:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        _delete:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        _update:{
            type: DataTypes.INTEGER,
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
          type: DataTypes.BIGINT,
          allowNull: true
        },

      },
      {
        sequelize, 
        modelName: 'MenuPermission',
        tableName: 'tbl_employee_menu_permission', // specify table name here
        timestamps: false
      });
      
      return MenuPermission;
}


