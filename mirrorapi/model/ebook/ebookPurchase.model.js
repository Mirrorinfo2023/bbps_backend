// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class ebookSales extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }

        static async getPurchaseList(ebook_id) {
            try{
            const banner = await this.findAll({
              
              where: {
                ebook_id: ebook_id,
                  status:1
              },
              order: [['id', 'DESC']],
            });
            return banner;
            } catch(err){
                console.error('Error:', err);
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

    

      

    ebookSales.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ebook_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        amount: {
              type: DataTypes.DOUBLE,
              allowNull: true
        },
        total_amount: {
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_date: {
              type: DataTypes.DATE,
              allowNull: true
        },
     
        discount:{
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        mobile_no:{
            type: DataTypes.DOUBLE,
            allowNull: true
        },
        is_free: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
  
      },
      {
        sequelize, 
        modelName: 'ebookSales',
        tableName: 'tbl_ebook_sales_report', // specify table name here
        timestamps: false
      });
      
      return ebookSales;
}


