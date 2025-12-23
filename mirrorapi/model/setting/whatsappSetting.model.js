// Define the affiliate model
module.exports = (sequelize, DataTypes, Model) => {

    class whatsappSetting extends Model {
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
      
      
      static async getDataRow(whereCondition) {
        try {
          const whereCondition = {status: 1};
          const result = await this.findOne({
          
            where: {...whereCondition}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
    }
    whatsappSetting.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        instance_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        access_token:{
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
        updated_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
    
      },


      {
        sequelize, 
        modelName: 'whatsappSetting',
        tableName: 'mst_whatsapp_setting', // specify table name here
        timestamps: false
      });
      
      return whatsappSetting;
}


