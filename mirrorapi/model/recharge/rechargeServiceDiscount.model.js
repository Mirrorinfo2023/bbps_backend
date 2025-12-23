// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class rechargeServiceDiscount extends Model {
      static async getOperatorCode(operator_id, operator_type) {
        try {
          const result = await this.findOne({
              where: {
                operator_id,
                operator_type,
                status: 1,
              }
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
    }

    rechargeServiceDiscount.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        operator_type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        operator_id: {
            type: DataTypes.BIGINT,
            allowNull: false
            },
        service_rate: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        cashback_rate:{
            type: DataTypes.DOUBLE,
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
        }
  
      },
      {
        sequelize, 
        modelName: 'rechargeServiceDiscount',
        tableName: 'mst_recharge_service_discount', // specify table name here
        timestamps: false
      });
      
      return rechargeServiceDiscount;
}


