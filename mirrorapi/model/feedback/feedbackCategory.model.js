// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class feedbackCategory extends Model {

        static async getFeedbackCategory() {
            const feedbackCategory = await this.findAll({
            order: [['id', 'DESC']],
            });
            return feedbackCategory;
        }
        
       static async getCategoryData( whereCondition) {
        try {
          const result = await this.findAll({
              
              where: whereCondition,
              
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }

    

      

    feedbackCategory.init({
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
        img : {
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
        cat_group: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        
  
      },
      {
        sequelize, 
        modelName: 'feedbackCategory',
        tableName: 'mst_feedback_category', // specify table name here
        timestamps: false
      });
      
      return feedbackCategory;
}


