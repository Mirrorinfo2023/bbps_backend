
module.exports = (sequelize, DataTypes, Model) => {

    class faqs extends Model {

      static async getData() {
            const result = await this.findAll({
            where: {status:1},
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

      static async getDataWithClause(lead_id) {
        try {
          const result = await this.findAll({
            where: {status:1, lead_id:lead_id},
            order: [['created_on', 'ASC']],
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

    

      

    faqs.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        category_id: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        lead_id:{
          type: DataTypes.BIGINT,
          allowNull: false
        },
        question : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        answer : {
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
        }
        
      },
      {
        sequelize, 
        modelName: 'faqs',
        tableName: 'tbl_faqs', // specify table name here
        timestamps: false
      });
      
      return faqs;
}


