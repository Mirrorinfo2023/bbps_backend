
module.exports = (sequelize, DataTypes, Model) => {

    class viewLeadsDetails extends Model {

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

    
  

    viewLeadsDetails.init({
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
          allowNull: false
        },

        lead_value: {
            type: DataTypes.STRING,
            allowNull: false
          },

        category_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
      
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lead_details_description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        lead_detail_group:{
            type: DataTypes.STRING,
            allowNull: true
        },
        image:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        lead_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        header_description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        specification:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        category_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        category_description:{
            type: DataTypes.TEXT,
            allowNull: true
        },
        mst_lead_header_status:
        {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sequence:{
            type: DataTypes.STRING,
            allowNull: true
        },
        lead_field_lebel:{
            type: DataTypes.STRING,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        lead_details_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
      
        
      },
      {
        sequelize, 
        modelName: 'viewLeadsDetails',
        tableName: 'view_leads_details', // specify table name here
        timestamps: false
      });
      
      return viewLeadsDetails;
}


