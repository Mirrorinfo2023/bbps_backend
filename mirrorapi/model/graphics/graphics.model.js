// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class graphics extends Model {

        static async getData() {
            const Category = await this.findAll({
            where: {status:1},
            order: [['id', 'DESC']],
            });
            return Category;
        }


        static async getGraphics(whereClause) {
            const Category = await this.findAll({
                where: whereClause,
                order: [['id', 'DESC']],
            });
            return Category;
        }
        
        static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({
            
                attributes: [
                    'id',
                    'category_id',
                    'graphics_name',
                    'status',
                    'image',
                    'like_count',
                    'share_count',
                    'created_by',
                    'modified_by' ,
                    'cat_group',
                    [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
                    [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on'],
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
            
            const result = await this.update(data, {
                where: whereClause
            });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

  


    }

    

      

    graphics.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        graphics_name: {
            type: DataTypes.STRING,
            allowNull: false
          },
        image : {
              type: DataTypes.TEXT,
              allowNull: false
        },
        like_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        share_count: {
            type: DataTypes.INTEGER,
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
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cat_group: {
            type: DataTypes.STRING,
            allowNull: true
        },
        
  
      },
      {
        sequelize, 
        modelName: 'graphics',
        tableName: 'tbl_graphics_report', // specify table name here
        timestamps: false
      });
      
      return graphics;
}


