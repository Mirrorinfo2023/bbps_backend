// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class feedbackReason extends Model {

        static async getFeedbackReason(category_id) {
            const feedbackCategory = await this.findAll({
              where: {
                feedback_cat_id:category_id,
               
                status: 1,
                
              },
              order: [['id', 'DESC']],
            
            });
            return feedbackCategory;
      }
      


    }

    

      

    feedbackReason.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        feedback_cat_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reason_name: {
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
        }
        
        
  
      },
      {
        sequelize, 
        modelName: 'feedbackReason',
        tableName: 'mst_feedback_reason', // specify table name here
        timestamps: false
      });
      
      return feedbackReason;
}


