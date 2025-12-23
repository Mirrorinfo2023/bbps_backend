// Define the BBPS bill fetch model
module.exports = (sequelize, DataTypes, Model) => {

    class ccavenueRequest extends Model {
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
    ccavenueRequest.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        merchant_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
          type: DataTypes.DOUBLE,
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
        encrequest: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        redirect_url: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        cancel_url: {
          type: DataTypes.TEXT,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'ccavenueRequest',
        tableName: 'tbl_ccvenue_request', // specify table name here
        timestamps: false
      });
      
      return ccavenueRequest;
}


