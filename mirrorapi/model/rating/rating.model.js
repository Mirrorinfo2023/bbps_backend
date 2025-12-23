// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class rating extends Model {

        static async getData() {
            const Category = await this.findAll({
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
                    'name',
                    'description',
                    'meeting_date',
                    'meeting_time',
                    'emeeting_date',
                    'emeeting_time',
                    'meeting_link',
                    'image',
                    'created_by',
                    'status',
                    'modified_by' ,

                  
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

  


    }

    

    rating.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          service: {
            type: DataTypes.STRING,
            allowNull: false
          },
          rate : {
              type: DataTypes.INTEGER,
              allowNull: false
         },
         app_id : {
            type: DataTypes.INTEGER,
            allowNull: true
         },
        review: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
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
        modelName: 'rating',
        tableName: 'tbl_user_rating', // specify table name here
        timestamps: false
      });
      
      return rating;
}


