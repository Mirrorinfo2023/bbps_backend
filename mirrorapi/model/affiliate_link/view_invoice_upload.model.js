// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class viewAffiliateInvoiceUpload extends Model {

      static async getData(category_id) {
            try{
            const data = await this.findAll({
              where: {
                  category_id: category_id,
                  status:1
              },
              order: [['id', 'DESC']],
            });
            return data;
            } catch(err){
                console.error('Error:', error);
            }
      }



      static async getAffliateInvoivceList(whereCondition) {
        try{
        const result = await this.findAll({
          where: whereCondition,
          order: [['id', 'DESC']],
        });
        return result;
        } catch(err){
            console.error('Error:', error);
        }
     }



      
      static async updateData(data, whereClause) {
        try {
            const result = await this.update(data, {
                where: whereClause
            });
            if(result){
                return { error: 0, message: 'Updated', result:result.id };
            }else{
                return { error: 1, message: 'Not update', result:'' };
            }
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }
      
      
      static async getDataById(lead_id) {
        const result = await this.findOne({
          where: {id:lead_id},
          order: [['id', 'DESC']],
          });
          return result;
      }


    }
    



    viewAffiliateInvoiceUpload.init({
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mlm_id: {
            type: DataTypes.STRING,
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
        purchase_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
        portal_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        category_id : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        invoice: {
            type: DataTypes.STRING,
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
        affiliate_Status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        remarks: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        entry_date:{
            type: DataTypes.STRING,
            allowNull: true
        },
         affiliate_link_id:{
          type: DataTypes.INTEGER,
          allowNull: true
        },
         distributed_amount:{
            type: DataTypes.DOUBLE,
            allowNull: true
          },
     
     
        
      },
      {
        sequelize, 
        modelName: 'viewAffiliateInvoiceUpload',
        tableName: 'view_affiliate_invoice_upload', // specify table name here
        timestamps: false
      });
      
      return viewAffiliateInvoiceUpload;
}


