
module.exports = (sequelize, DataTypes, Model) => {

    class CustomerCart extends Model {

        static async createCart(data) {
            try {
                const cart = await this.create(data);
                return { error: 0, message: 'cart Created', result: cart };
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }


static async getCart(page,pageSize) {
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



CustomerCart.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    product_img: {
        type: DataTypes.STRING(255),
        allowNull: true // You can set to false if the field is required
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true // You can set to false if the field is required
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true // You can set to false if the field is required
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true // You can set to false if the field is required
    },
    total_qnty: {
        type: DataTypes.INTEGER,
        allowNull: true // You can set to false if the field is required
    },
    totalprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true // You can set to false if the field is required
    },
    delivery_date: {
        type: DataTypes.DATE,
        allowNull: true // You can set to false if the field is required
    }
}, {
sequelize,
modelName: 'CustomerCart',
tableName: 'tbl_customercart',
timestamps: false
});

CustomerCart.associate = function(models) {
    CustomerCart.belongsTo(models.MstVendorProduct, { foreignKey: 'product_id' });
};


return CustomerCart;

}


