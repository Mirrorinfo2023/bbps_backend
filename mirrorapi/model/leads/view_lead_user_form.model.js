
module.exports = (sequelize, DataTypes, Model) => {

    class viewLeadsUserForm extends Model {

      static async getData() {
            const result = await this.findAll({
            where: {status:1},
            order: [['id', 'DESC']],
            });
            return result;
      }

      static async getDataById(form_id) {
        const result = await this.findOne({
          where: {id:form_id},
          order: [['id', 'DESC']],
          });
          return result;
      }

      static async getDataWithClause(whereClause) {
        try {
          const result = await this.findAll({
            where: {status:1, category_id:whereClause},
            order: [['created_on', 'ASC']],
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
      

    }

    viewLeadsUserForm.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        category_id:{
          type: DataTypes.INTEGER,
          allowNull: false
        },
        lead_id : {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        description : {
            type: DataTypes.TEXT,
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
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        
        lead_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        first_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        mlm_id: {
            type: DataTypes.TEXT,
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
        category_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parent_category_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        entry_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
      },
      {
        sequelize, 
        modelName: 'viewLeadsUserForm',
        tableName: 'view_lead_user_form', // specify table name here
        timestamps: false
      });
      
      return viewLeadsUserForm;
}


