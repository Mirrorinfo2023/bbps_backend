const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class ebookList extends Model {

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
                created_by: user_id,
                  status:1
              },
              order: [['id', 'DESC']],
            });
            return banner;
          } catch(err){
            console.error('Error:', err);
            }
      
      }
      
       static async getRandomEbook(plan) {
           let booklimit = 0;
           if(plan == 1){
               booklimit = 5;
           }
           if(plan == 2){
               booklimit = 7;
           }
           if(plan == 3 || plan == 4){
               booklimit = 10;
           }
            try{
            const banner = await this.findAll({
              
              where: {
                  status:1
              },
              order: Sequelize.literal('RAND()'),
              limit: booklimit
            });
            return banner;
          } catch(err){
            console.error('Error:', err);
            }
      
      }

      static async getAllData(whereCondition) {
        try {
          const result = await this.findAll({
              where: whereCondition,
              order: [['id', 'DESC']],
            });
            return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
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
      
      
      static async getListByCategories(categories) {
        try {
           
            const ebooks = await this.findAll({
                where: {
                    category: {
                        [Op.in]: [categories]
                    }
                },
                order: [['id', 'DESC']],
            });
    
            return ebooks;
        } catch(err) {
            console.error('Error:', err);
            throw err; // rethrow the error to handle it at a higher level if needed
        }
    }


     

    }

    

      

    ebookList.init({
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
        imges: {
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
            allowNull: false
        },
        refund_day_limit:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        created_on: {
              type: DataTypes.DATE,
              allowNull: false
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
        category_name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        ebook_created_date: {
          type: DataTypes.STRING,
          allowNull: true
        },
    
        first_name:{
            type: DataTypes.STRING,
          allowNull: true
        },
        last_name:{
            type: DataTypes.STRING,
          allowNull: true
        }
        
        
        
  
      },
      {
        sequelize, 
        modelName: 'ebookList',
        tableName: 'view_ebook_list', // specify table name here
        timestamps: false
      });
      
      return ebookList;
}


