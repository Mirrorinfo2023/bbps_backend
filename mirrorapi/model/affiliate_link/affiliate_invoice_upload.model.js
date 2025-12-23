// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class affiliateInvoiceUpload extends Model {

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

      static async insertData(data) {
        try {
          const result = await this.create(data);
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
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


    }
    



    affiliateInvoiceUpload.init({
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
         remarks: {
            type: DataTypes.TEXT,
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
        modelName: 'affiliateInvoiceUpload',
        tableName: 'tbl_affiliate_invoice_uploade', // specify table name here
        timestamps: false
      });
      
      return affiliateInvoiceUpload;
}


