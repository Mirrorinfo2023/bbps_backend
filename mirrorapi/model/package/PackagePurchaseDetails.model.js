// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class PackagePurchaseDetails extends Model {
      
      static async insertData(data) {
          try {
            const result = await this.create(data);
              return result;
          } catch (error) {
              console.error('Error:', error);
              throw error;
          }
        }
    
  }

  PackagePurchaseDetails.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        package_purchase_id:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        total_price: {
            type: DataTypes.DECIMAL,
            allowNull: true
        }, 
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

    },
    {
      sequelize, 
      modelName: 'PackagePurchaseDetails',
      tableName: 'tbl_package_purchase_details', // specify table name here
      timestamps: false
    });
    
    return PackagePurchaseDetails;
}