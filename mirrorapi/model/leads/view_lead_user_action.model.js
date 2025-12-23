
module.exports = (sequelize, DataTypes, Model) => {

    class viewLeadsUserAction extends Model {

      static async getData() {
            const result = await this.findAll({
            where: {status:1},
            order: [['id', 'DESC']],
            });
            return result;
      }

      static async getDataById(lead_id) {
        const result = await this.findOne({
          where: {id:lead_id},
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

    viewLeadsUserAction.init({
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
        action : {
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
        lead_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        specification: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_earning: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        distribution_amount: {
            type: DataTypes.DOUBLE,
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
        category_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parent_category_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        distributed_amount: {
            type: DataTypes.STRING,
            allowNull: true
        },
        entry_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
         lead_Status: {
          type: DataTypes.STRING,
          allowNull: true
        },
         remarks: {
          type: DataTypes.TEXT,
          allowNull: true
        }

        
      },
      {
        sequelize, 
        modelName: 'viewLeadsUserAction',
        tableName: 'view_leads_user_action', // specify table name here
        timestamps: false
      });
      
      return viewLeadsUserAction;
}


