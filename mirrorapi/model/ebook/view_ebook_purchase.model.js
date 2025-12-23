const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ebookPurchaseReport extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }

        static async getPurchaseList(whereClause) {
            try{
            const banner = await this.findAll({
              
              where: whereClause,
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
        
        static async getDistinctCategory(whereClause) {
            try{
            const banner = await this.findOne({
                
                attributes: [
                    [
                        sequelize.fn('GROUP_CONCAT', sequelize.fn('DISTINCT', sequelize.col('category'))),
                        'category'
                    ]
                ],
                where: whereClause,
            });
            return banner;
            } catch(err){
                console.error('Error:', err);
            }
      
        }



     

    }

    

      

    ebookPurchaseReport.init({
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
        ebook_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author : {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        total_quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_discount:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        refund:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        refund_day_limit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imges:{
            type: DataTypes.STRING,
            allowNull: false
        },
        first_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        mlm_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        purchase_date:{
            type: DataTypes.STRING,
            allowNull: false
        },
        book_file: {
            type: DataTypes.STRING,
            allowNull: true
        }
    

      },
      {
        sequelize, 
        modelName: 'ebookPurchaseReport',
        tableName: 'view_ebook_purchase', // specify table name here
        timestamps: false
      });
      
      return ebookPurchaseReport;
}


