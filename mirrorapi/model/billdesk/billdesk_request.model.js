// Define the BBPS bill fetch model
module.exports = (sequelize, DataTypes, Model) => {

    class BilldeskRequest extends Model {
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
          const result = await this.findOne({
            where: {...whereParam}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async UpdateData(data, whereClause) {
            try {
            const result = await this.update(data, {
                where: {...whereClause}
            });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

    
    }
    BilldeskRequest.init({
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        billdesk_order_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bdorderid: {
              type: DataTypes.STRING,
              allowNull: false
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        order_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        redirect_url: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true
        },
        order_response: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        txn_id:{
          type: DataTypes.STRING,
          allowNull: true
        },
        transaction_date:{
          type: DataTypes.DATE,
          allowNull: true
        },
        payment_amount:{
          type: DataTypes.DOUBLE,
          allowNull: true
        },
        bank_ref_no:{
          type: DataTypes.STRING,
          allowNull: true
        },
        payment_method_type:{
          type: DataTypes.STRING,
          allowNull: true
        },
        transaction_error_desc:{
          type: DataTypes.TEXT,
          allowNull: true
        },
        response_json:{
          type: DataTypes.TEXT,
          allowNull: true
        },
        payment_status:{
          type: DataTypes.INTEGER,
          allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'BilldeskRequest',
        tableName: 'tbl_billdesk_request', // specify table name here
        timestamps: false
      });
      
      return BilldeskRequest;
}


