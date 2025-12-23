
module.exports = (sequelize, DataTypes, Model) => {

    class LeadRemarks extends Model {


        static async insert(data) {
            try {
                const result = await this.create(data);
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }


        static async getCount(user_id,remarks) {
            try {
              const result = await this.count({
                where: {user_id,remarks, 'status':1}
              });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
    
          static async getUserRemarks(user_id,lead_id, category_id) {
            try {
                const result = await this.findOne({
                    where: {
                        'user_id': user_id,
                        'lead_id': lead_id, 
                        'category_id': category_id,
                        'status': 1,
                    }
                });
              return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }


    }

      

    LeadRemarks.init({
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
        remarks:{
          type: DataTypes.BIGINT,
          allowNull: false
        },
        followup_count: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        lead_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category_id:{
            type: DataTypes.INTEGER,
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
        created_by:{
            type: DataTypes.BIGINT,
            allowNull: true
        }
        
      },
      {
        sequelize, 
        modelName: 'LeadRemarks',
        tableName: 'log_user_lead_remarks', // specify table name here
        timestamps: false
      });
      
      return LeadRemarks;
}


