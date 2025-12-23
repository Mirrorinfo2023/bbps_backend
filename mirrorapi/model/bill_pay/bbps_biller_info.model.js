// Define the BBPS bill fetch model
module.exports = (sequelize, DataTypes, Model) => {

    class BbpsBillerInfo extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getAllData() {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findAll({
            where: {...fixedCondition}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getData(whereParam) {
        try {
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            where: {...whereParam}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

    
    }

    BbpsBillerInfo.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        biller_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id:{
            type: DataTypes.BIGINT,
            allowNull: true
        },
        biller_name: {
              type: DataTypes.TEXT,
              allowNull: false
              },
        biller_coverage: {
              type: DataTypes.STRING,
              allowNull: true
          },
        biller_adhoc: {
              type: DataTypes.STRING,
              allowNull: true
        },
        distributor_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        consumer_id: {
          type: DataTypes.STRING,
          allowNull: true
        },
        biller_category: {
          type: DataTypes.STRING,
          allowNull: true
        },
        input_params: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        response_json: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        }, 
        biller_fetch_requiremet: {
            type: DataTypes.STRING,
            allowNull: true
        }
      },
      {
        sequelize, 
        modelName: 'BbpsBillerInfo',
        tableName: 'tbl_bbps_bill_info', // specify table name here
        timestamps: false
      });
      
      return BbpsBillerInfo;
}


