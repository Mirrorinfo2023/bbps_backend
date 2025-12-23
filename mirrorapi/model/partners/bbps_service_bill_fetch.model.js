// Define the BBPS bill fetch model
module.exports = (sequelize, DataTypes, Model) => {

    class BbpsBillFetch extends Model {
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
    BbpsBillFetch.init({
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
        biller_id: {
              type: DataTypes.STRING,
              allowNull: false
          },
        request_id: {
              type: DataTypes.STRING,
              allowNull: false
        },
        request_data: {
            type: DataTypes.STRING,
            allowNull: false
        },
        response_data: {
            type: DataTypes.STRING,
            allowNull: true
        },
        consumer_no: {
          type: DataTypes.STRING,
          allowNull: false
        },
        consumer_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        bill_amount: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        late_fine:{
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        fixed_charge:{
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        additional_charge: {
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        bill_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        bill_period: {
            type: DataTypes.STRING,
            allowNull: true
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        bill_number: {
            type: DataTypes.STRING,
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
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        response_json: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        input_params: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        biller_response: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        additional_info: {
          type: DataTypes.TEXT,
            allowNull: true
        },
        email:{
          type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
          type: DataTypes.STRING,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'BbpsBillFetch',
        tableName: 'tbl_bbps_bill_fetch', // specify table name here
        timestamps: false
      });
      
      return BbpsBillFetch;
}


