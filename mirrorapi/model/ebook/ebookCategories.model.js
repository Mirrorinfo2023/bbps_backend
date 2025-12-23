const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ebookCategories extends Model {

        static async getData() {
            const Category = await this.findAll({
                attributes: [
                    'id',
                    'category_name',
                    'status' ,
                    [Sequelize.fn('date_format', Sequelize.col('created_on'), '%Y-%m-%d %H:%i:%s'), 'created_on'],
                   
                  ],
                  where:{status: 1},
                order: [['id', 'DESC']],
            });
            return Category;
        }

        static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({
                  attributes: [
                        'id',
                        'category_name',
                        'status' ,
                        [Sequelize.fn('date_format', Sequelize.col('created_on'), '%Y-%m-%d %H:%i:%s'), 'created_on'],
                       
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


      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      static async UpdateData(data , whereClause) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: whereClause
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


     

    }

    

      

    ebookCategories.init({
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
        status:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: true
        },
     
  
      },
      {
        sequelize, 
        modelName: 'ebookCategories',
        tableName: 'mst_ebook_categories', // specify table name here
        timestamps: false
      });
      
      return ebookCategories;
}


