// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class graphicsCategory extends Model {

        static async getGraphicsCategory() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
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
            allowNull: false
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
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


