// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ratingDetails extends Model {

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

    

    ratingDetails.init({
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
        rating_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mlm_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        app_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
    
  
      },
      {
        sequelize, 
        modelName: 'ratingDetails',
        tableName: 'view_rating', // specify table name here
        timestamps: false
      });
      
      return ratingDetails;
}


