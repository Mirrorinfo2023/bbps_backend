// models/customer_address.model.js
// Adjust the path as needed
module.exports = (sequelize, DataTypes, Model) => {

class CustomerAddress extends Model {

    static async createAddress(data) {
        try {
            const address = await this.create(data);
            return { error: 0, message: 'Address Created', result: address };
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    
    static async getCustomer(page,pageSize) {
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

    

CustomerAddress.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    last_name: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    userid: {
        type: DataTypes.INTEGER,
       // allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    address1: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    address2: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    address3: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    pincode: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    city: {
        type: DataTypes.STRING(300),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'CustomerAddress',
    tableName: 'tbl_customers',
    timestamps: false
});

CustomerAddress.associate = function(models) {
    // Assuming the MstAppUsers model is defined elsewhere
    CustomerAddress.belongsTo(models.AppUser, { foreignKey: 'userid' });
};

return CustomerAddress;

}


