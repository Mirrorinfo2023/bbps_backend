// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class Product extends Model {
      
        static async UpdateData(data, whereClause) {
            try {
                const updateRecharge = await this.update(data, {
                    where: whereClause
                });
                if(updateRecharge){
                    return { error: 0, message: 'Updated', result:updateRecharge.id };
                }else{
                    return { error: 1, message: 'Not update', result:'' };
                }
                
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
         
        static async getAllDataList(page,pageSize) {
            const offset = (page - 1) * pageSize;
            
            try {
              const result = await this.findAll({
                where: {
                    status: 1
                },
                limit: pageSize,
                offset: offset
            });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
      
      
        static async insertData(data) {
            try {
              const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
      
        static async findProductById(product_id) {
        
            try {
                const result = await this.findOne({
                    where: {
                        id: product_id
                    },
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
   
      
    }

    Product.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
          type: DataTypes.STRING,
          allowNull: false
      },
      unit_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      purchase_price: {
        type: DataTypes.STRING,
        allowNull: false
      },
      details: {
        type: DataTypes.DECIMAL,
        allowNull: true
      }, 
      
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true
    },
    benefit: {
        type: DataTypes.TEXT,
        allowNull: true
    }

    },
    {
      sequelize, 
      modelName: 'Product',
      tableName: 'mst_vendor_product', // specify table name here
      timestamps: false
    });
    
       
      return Product;
}


