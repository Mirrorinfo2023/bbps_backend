// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class ProductImages extends Model {
      
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
        
        static async getAllData(whereClause) {
            
            try {
              const result = await this.findAll({
                where: {
                    ...whereClause
                },
                order: [['id', 'desc']]
            });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }
   
      
    }

    ProductImages.init({
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      product_id:{
          type: DataTypes.INTEGER,
          allowNull: false
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

    },
    {
      sequelize, 
      modelName: 'ProductImages',
      tableName: 'mst_vendor_product_images', // specify table name here
      timestamps: false
    });
    
       
      return ProductImages;
}


