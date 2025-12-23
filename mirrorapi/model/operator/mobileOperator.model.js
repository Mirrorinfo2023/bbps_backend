// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class mobileOperator extends Model {
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
          const result = await this.findAll({
              where: {
                status: 1,
              },
              order: [['operator_name', 'ASC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      static async getCount(mobile, operator_id) {
        try {
          const result = await this.count({
              where: {
                mobile_no: mobile,
                operator_id: operator_id,
                status: 1,
              },
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async getDataWithClause(whereClause) {
        try {
          const result = await this.findAll({
            where: {status:1, category:whereClause},
            order: [['operator_name', 'ASC']],
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    }

    mobileOperator.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        operator_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        operator_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        circle: {
              type: DataTypes.TEXT,
              allowNull: true
              },
        mobile_no: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
          },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: DataTypes.NOW
        },
        modified_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'mobileOperator',
        tableName: 'tbl_mobile_operator', // specify table name here
        timestamps: false
      });
      
      return mobileOperator;
}


