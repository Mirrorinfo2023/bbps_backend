const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class viewCourseVideo extends Model {

        static async getGraphicsCategory() {
            const Category = await this.findAll({
              where: {status:1},
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

    

      

    viewCourseVideo.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        video_link: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category_id:{
            type: DataTypes.INTEGER,
            allowNull: false
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
        category_name:{
            type: DataTypes.STRING,
            allowNull: true
        } ,
        course_created_date:{
            type: DataTypes.STRING,
            allowNull: true
        },
        thumbnail_img:{
            type: DataTypes.TEXT,
            allowNull: true
        }
      
      
        
  
      },
      {
        sequelize, 
        modelName: 'viewCourseVideo',
        tableName: 'view_course_videos', // specify table name here
        timestamps: false
      });
      
      return viewCourseVideo;
}


