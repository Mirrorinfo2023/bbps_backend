// Define the affiliate model
module.exports = (sequelize, DataTypes, Model) => {

    class Setting extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(attribute) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findAll({
            attributes: [...attribute],
            where: {...fixedCondition}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      static async getDataRow(attribute) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...fixedCondition}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
    }
    Setting.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        recharge_cutoff_limit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        bbps_cutoff_limit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recharge_panel_cron:{
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
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        last_modified: {
          type: DataTypes.STRING,
          allowNull: true
        },
      },
      {
        sequelize, 
        modelName: 'setting',
        tableName: 'mst_api_settings', // specify table name here
        timestamps: false
      });
      
      return Setting;
}


