// Define the menu model
module.exports = (sequelize, DataTypes, Model) => {

    class ViewMenuPermission extends Model {
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
    ViewMenuPermission.init({
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
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobile: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

      },
      {
        sequelize, 
        modelName: 'ViewMenuPermission',
        tableName: 'view_menu_permission', // specify table name here
        timestamps: false
      });
      
      return ViewMenuPermission;
}


