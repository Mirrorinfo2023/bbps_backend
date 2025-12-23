// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class affiliate_linkCategory extends Model {

      static async getCategory() {
            try{
                const category = await this.findAll({
                
                  where: {
                      status: 1
                  },
                order: [['id', 'DESC']],
                });
                return category;
            } catch(err){
                logger.error(`Unable to find Category: ${err}`);
            }
      
      }

      static async getCategoryWithCategoryId(category_id) {
        try{
            const category = await this.findOne({
            
              where: {
                  id: category_id
              },
            order: [['id', 'DESC']],
            });
            return category;
        } catch(err){
            logger.error(`Unable to find Category: ${err}`);
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
      
        static async getDataWithClause(whereClause) {
        try {
          const result = await this.findAll({
            where: {status:1, category_name:whereClause},
            order: [['created_on', 'ASC']],
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      

      // static async updateData(data,id) {
      //   try {
      //     // console.log(data);
      //     const result = await this.update(data, {
      //       where: { id :id }
      //     });
      //       return result;
      //   } catch (error) {
      //       console.error('Error:', error);
      //       throw error;
      //   }
      // }

      static async updateData(data, whereClause) {
        try {
            const updateInsuarnce = await this.update(data, {
                where: whereClause
            });
            if(updateInsuarnce){
                return { error: 0, message: 'Updated', result:updateInsuarnce.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }
    



    affiliate_linkCategory.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
     
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: true
        },
        discount_amount:{
              type: DataTypes.DOUBLE,
              allowNull: true
        }
     
     
        
      },
      {
        sequelize, 
        modelName: 'affiliate_linkCategory',
        tableName: 'mst_affiliate_category', // specify table name here
        timestamps: false
      });
      
      return affiliate_linkCategory;
}


