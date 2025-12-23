// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class frequentQuestions extends Model {

        static async getFaq() {
            const feedbackCategory = await this.findAll({
            order: [['id', 'DESC']],
            });
            return feedbackCategory;
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

      static async getData( whereCondition) {
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

    
  
    frequentQuestions.init({
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
        question : {
              type: DataTypes.TEXT,
              allowNull: false
        },
        answer: {
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
        modelName: 'frequentQuestions',
        tableName: 'tbl_frequently_asked_questions', // specify table name here
        timestamps: false
      });
      
      return frequentQuestions;
}


