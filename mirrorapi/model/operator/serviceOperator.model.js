// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class serviceOperator extends Model {
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
      
      static async getData(biller_id) {
        try {
          const result = await this.findOne({
            where: {status:1, biller_id:biller_id},
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
    }

    serviceOperator.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        operator_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
              type: DataTypes.TEXT,
              allowNull: false
              },
        category: {
          type: DataTypes.STRING,
          allowNull: true
        },
        image: {
              type: DataTypes.STRING,
              allowNull: false
          },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        deleted_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        biller_id: {
            type: DataTypes.STRING,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'serviceOperator',
        tableName: 'mst_service_operator', // specify table name here
        timestamps: false
      });
      
      return serviceOperator;
}


