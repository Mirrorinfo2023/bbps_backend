// Define the BBPS bill fetch model
module.exports = (sequelize, DataTypes, Model) => {

    class ccavenueResponse extends Model {
      static async insertData(data) {
        try {
          const result = await this.create(data);
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
    ccavenueResponse.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        merchant_id:{
            type: DataTypes.STRING,
            allowNull: true
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        res_status: {
            type: DataTypes.STRING,
            allowNull: true
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
        encresponse: {
          type: DataTypes.TEXT,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'ccavenueResponse',
        tableName: 'tbl_ccvenue_response', // specify table name here
        timestamps: false
      });
      
      return ccavenueResponse;
}


