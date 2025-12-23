// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class page extends Model {

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
              const result = await this.findOne({
                where: {status:1, category:whereClause},
                order: [['created_on', 'ASC']],
              });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
          
          
        static async getAllData() {
            try {
              const result = await this.findAll({
                  where: {
                    status: 1,
                  },
                  order: [['created_on', 'DESC']],
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


          

          


    }

    page.init({
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
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
          category: {
            type: DataTypes.STRING,
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
        modified_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_on: {
            type: DataTypes.DATE,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'page',
        tableName: 'tbl_page_details', // specify table name here
        timestamps: false
      });
      
      return page;
}


