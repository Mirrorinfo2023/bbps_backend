
module.exports = (sequelize, DataTypes, Model) => {

    class userFormDetails extends Model {

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
          const result = await this.findAll({
            where: {status:1, ...whereClause},
            order: [['id', 'ASC']],
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


    userFormDetails.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_form_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        field_header:{
          type: DataTypes.STRING,
          allowNull: false
        },
        field_value : {
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
        updated_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        data_type: {
          type: DataTypes.STRING,
          allowNull: true
        },
        
      },
      {
        sequelize, 
        modelName: 'userFormDetails',
        tableName: 'tbl_lead_user_form_details', // specify table name here
        timestamps: false
      });
      
      return userFormDetails;
}


