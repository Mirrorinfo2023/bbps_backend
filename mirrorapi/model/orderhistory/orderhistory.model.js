
module.exports = (sequelize, DataTypes, Model) => {

    class OrderHistory extends Model {

static async getOrderhistory(page,pageSize) {
    const offset = (page - 1) * pageSize;

   
    try {
      const result = await this.findAll({
        // where: {
        //     status: 1
        // },
        limit: pageSize,
        offset: offset
    });
      return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
  }
  }

  
OrderHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      delivery_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_img: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      product_detail: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
  {
    sequelize, 
    modelName: 'OrderHistory',
    tableName: 'tbl_order_history', // specify table name here
    timestamps: false
  });

  OrderHistory.associate = function(models) {
    OrderHistory.belongsTo(models.MstVendorProduct, { foreignKey: 'product_id' });
};
  
 return OrderHistory;

}

  
  

