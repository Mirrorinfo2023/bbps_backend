// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class banner extends Model {

    static async getBanner(type_id) {
      try {
        const banner = await this.findAll({

          where: {
            type_id: type_id,
            status: 1
          },
          order: [['id', 'DESC']],
        });
        return banner;
      } catch (err) {
        logger.error(`Unable to find Banner: ${err}`);
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

    static async UpdateData(data, whereClause) {
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


  banner.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    img: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner_for: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
    deleted_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    app_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },



  },
    {
      sequelize,
      modelName: 'banner',
      tableName: 'tbl_banners', // specify table name here
      timestamps: false
    });

  return banner;
}


