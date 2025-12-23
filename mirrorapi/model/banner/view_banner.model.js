// Define the Countries model
module.exports = (sequelize, DataTypes, Model) => {

  class view_banner extends Model {



    static async getBannerAll(whereClause) {
      try {
        const banner = await this.findAll({

          where: whereClause,
          order: [['created_on', 'DESC']],
        });
        return banner;
      } catch (err) {
        console.error('Error:', err);
        throw err;
      }

    }

  }

  view_banner.init({
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
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified_on: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted_on: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    app_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    app_name: {
      type: DataTypes.STRING,
      allowNull: false
    },



  },
    {
      sequelize,
      modelName: 'view_banner',
      tableName: 'view_banners', // specify table name here
      timestamps: false
    });

  return view_banner;
}


