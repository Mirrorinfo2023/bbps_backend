// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class gatewayRequestResponse extends Model {

      
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
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            where: {...fixedCondition, ...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async UpdateData(data , whereClause) {
        try {
        // console.log(data);
        const result = await this.update(data, {
            where: whereClause
        });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
      
      static async getDataExistance(attribute, whereClause) {
        try {
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    static async GetAllData() {
        try {
          const result = await this.findAll({
            where: {
              status: 1
            }
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      

      static async updateData(data,id) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: { id :id }
          });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }



      
    }

    gatewayRequestResponse.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },

        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        order_amount: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        request_json: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        order_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        response_json: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        payment_status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        payment_mode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bank_ref_no: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status_code:{
            type: DataTypes.STRING,
            allowNull: true
        },
        created_on: {
            type: DataTypes.STRING,
            allowNull: true
        },
        modified_on: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        }, 
        request_response_json: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        gateway:{
            type: DataTypes.STRING,
            allowNull: true
        }
          
     }, {
        sequelize, 
        modelName: 'gatewayRequestResponse',
        tableName: 'tbl_payment_gateway_request_response', // specify table name here
        timestamps: false
      });
      
      return gatewayRequestResponse;
}


