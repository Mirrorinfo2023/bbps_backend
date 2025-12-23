
module.exports = (sequelize, DataTypes, Model) => {

    class leads_details extends Model {

        static async getData() {
            const result = await this.findAll({
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

    

      

    leads_details.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        lead_header_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lead_header_label: {
          type: DataTypes.STRING,
          allowNull: true
        },
        category_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        lead_value: {
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        lead_detail_group: {
          type: DataTypes.STRING,
          allowNull: true
        },
        
        image: {
          type: DataTypes.STRING,
          allowNull: true
        },
        video: {
          type: DataTypes.STRING,
          allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'leads_details',
        tableName: 'tbl_leads_details', // specify table name here
        timestamps: false
      });
      
      return leads_details;
}


