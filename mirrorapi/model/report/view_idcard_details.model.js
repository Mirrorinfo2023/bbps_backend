// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class ViewIdCardDetails extends Model {
    

    }

    ViewIdCardDetails.init({
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
            allowNull: false
        },
        order_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        shipping_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        address_type:{
            type: DataTypes.STRING,
            allowNull: true
        },
        shipping_city:{
            type: DataTypes.STRING,
            allowNull: true
        },
        shipping_state:{
            type: DataTypes.STRING,
            allowNull: true
        },
        shipping_pincode:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        shipping_mobile_no:{
            type: DataTypes.STRING,
            allowNull: true
        },
        shipping_address:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        first_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        mlm_id:{
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile:{
            type: DataTypes.STRING,
            allowNull: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true
        },
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
            type: DataTypes.STRING,
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
        rejection_reason: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        entry_date: {
            type: DataTypes.STRING,
            allowNull: true
        }

     }, {
        sequelize, 
        modelName: 'ViewIdCardDetails',
        tableName: 'view_id_card_details', // specify table name here
        timestamps: false
      });
      
      return ViewIdCardDetails;
}


