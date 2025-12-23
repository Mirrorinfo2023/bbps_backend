// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class feedback_view extends Model {

        static async getFeedback() {
            const feedback = await this.findAll({
            // order: [['id', 'DESC']],
            });
            return feedback;
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
      
      
        static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({
                  where: whereCondition,
                   order: [['created_on', 'DESC'],['status', 'ASC']],
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

    }

    

      

    feedback_view.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        ticket_no: {
          type: DataTypes.STRING,
          allowNull: false
        },
        user_id : {
            type: DataTypes.INTEGER,
            allowNull: false
      },
        category_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reason_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        mobile : {
            type: DataTypes.STRING,
            allowNull: false
        },
        whatsapp_no : {
            type: DataTypes.STRING,
            allowNull: false
        },
        img : {
              type: DataTypes.TEXT,
              allowNull: false
        },
        problem_description: {
              type: DataTypes.TEXT,
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
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reason_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usermobile: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
          feedback_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
     
  
      },
      {
        sequelize, 
        modelName: 'feedback_view',
        tableName: 'view_feedback', // specify table name here
        timestamps: false
      });
      
      return feedback_view;
}


