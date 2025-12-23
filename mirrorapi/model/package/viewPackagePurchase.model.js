// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class ViewPackagePurchase extends Model {
        
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
  
    ViewPackagePurchase.init({
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
          package_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
          amount: {
              type: DataTypes.DECIMAL,
              allowNull: false
          },
          
          created_on: {
              type: DataTypes.DATE,
              allowNull: true
          },
          transaction_id: {
              type: DataTypes.STRING,
              allowNull: true
          },
          order_no: {
              type: DataTypes.STRING,
              allowNull: true
          },
          order_date: {
              type: DataTypes.DATE,
              allowNull: true
          },
          address: {
              type: DataTypes.TEXT,
              allowNull: true
          },
          order_status: {
              type: DataTypes.STRING,
              allowNull: true
          }, 
          status: {
              type: DataTypes.INTEGER,
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
          remarks: {
            type: DataTypes.TEXT,
            allowNull: true
          }, 
  
      },
      {
        sequelize, 
        modelName: 'ViewPackagePurchase',
        tableName: 'view_package_purchase', // specify table name here
        timestamps: false
      });
      
      return ViewPackagePurchase;
  }