// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class ebook extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }

      static async getEbook(user_id) {
            try{
            const banner = await this.findAll({
              
              where: {
                user_id: user_id,
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

    

      

    ebook.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
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
        images: {
              type: DataTypes.STRING,
              allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount:{
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        refund:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        refund_day_limit:{
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
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        sale_quantity:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        book_file: {
            type: DataTypes.STRING,
            allowNull: true
        },
    
        
  
      },
      {
        sequelize, 
        modelName: 'ebook',
        tableName: 'tbl_ebook_report', // specify table name here
        timestamps: false
      });
      
      return ebook;
}


