const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class graphicsCategory extends Model {

        static async getGraphicsCategory() {
            const Category = await this.findAll({
                where: {status:1},
            order: [['id', 'DESC']],
            });
            return Category;
      }
      
      static async getGraphicsCategoryWithCondition() {
        const Category = await this.findAll({
          where: {status:1,
            // id: {
            //   [Sequelize.Op.ne]: 17 // Exclude id 17
            // }
          },
        order: [['id', 'DESC']],
        });
        return Category;
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

      static async getData(attribute, whereCondition) {
            try {
              const result = await this.findOne({
                attributes: [...attribute],
                  where: whereCondition,
                  
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }


          static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({
                  attributes: [
                        'id',
                        'image',
                        'description',
                        'category_name',
                        'status' ,
                        [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
                       
                      ],
                  where: whereCondition,
                  order: [['created_on', 'DESC']],
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }

          static async getDataWithClause(whereClause) {
            try {
              const result = await this.findOne({
                where: {status:1, category_name:whereClause},
                order: [['created_on', 'ASC']],
              });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }

          static async UpdateData(data , whereClause) {
            try {
              const result = await this.update(data, {
                where: whereClause
              });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }

          
      static async getCategoryData(whereClause) {
            try {
              const result = await this.findOne({
                  where: whereClause,
                  order: [['created_on', 'DESC']]
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }



    }

    

      

    graphicsCategory.init({
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
        image : {
              type: DataTypes.TEXT,
              allowNull: false
        },
        description: {
              type: DataTypes.STRING,
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
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true
      },
        
        
  
      },
      {
        sequelize, 
        modelName: 'graphicsCategory',
        tableName: 'mst_graphics_category', // specify table name here
        timestamps: false
      });
      
      return graphicsCategory;
}


