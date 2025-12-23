// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class feedback extends Model {

        static async getFeedback() {
            const feedback = await this.findAll({
            order: [['id', 'DESC']],
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

    

      

    feedback.init({
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
        
        modified_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        deleted_on: {
          type: DataTypes.DATE,
          allowNull: true
        },
       
        
  
      },
      {
        sequelize, 
        modelName: 'feedback',
        tableName: 'tbl_feedback_report', // specify table name here
        timestamps: false
      });
      
      return feedback;
}


