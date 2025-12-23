// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

    class ebookImage extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }

      static async getImage(ebook_id) {
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

    

      

    ebookImage.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		      primaryKey: true,
		      autoIncrement: true
        },
        ebook_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        img: {
              type: DataTypes.STRING,
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
        
  
      },
      {
        sequelize, 
        modelName: 'ebookImage',
        tableName: 'tbl_ebook_images_report', // specify table name here
        timestamps: false
      });
      
      return ebookImage;
}


