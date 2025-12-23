// Define the Countries model
module.exports = (sequelize, DataTypes, Model, Op) => {

  class user extends Model {

    static buildSearchObjectWithOR(SearchOBJ) {
      const conditions = Object.keys(SearchOBJ).map((key) => ({
        [key]: SearchOBJ[key],
      }));

      return {
        [Op.or]: conditions,
      };
    }
    static buildSearchObjectWithLike(SearchOBJ) {

      const conditions = Object.keys(SearchOBJ).map((key) => ({
        [key]: {
          [Op.like]: `%${SearchOBJ[key]}%`,
        },
      }));

      return {
        [Op.or]: conditions,
      };
    }
    static async getUserSearchByData(SearchOBJ) {
      try {
        const users = this.findOne({
          where: {
            [Op.and]:
              [
                this.buildSearchObjectWithLike(SearchOBJ),
                { status: 1 },
              ],
          },
        });

        return users;

      } catch (error) {
        // console.error('Error fetching user data:', error.message);
        throw error;
      }
    }

    static async getUserSearchByDataWithOR(SearchOBJ) {
      try {
        const users = this.findOne({
          where: {
            [Op.and]:
              [
                this.buildSearchObjectWithOR(SearchOBJ),
                { status: 1 },
              ],
          },
        });

        return users;

      } catch (error) {
        // console.error('Error fetching user data:', error.message);
        throw error;
      }
    }

    static async getUserSearchByDataWithORStatus(SearchOBJ) {
      try {
        const users = this.findOne({
          where: {
            [Op.and]:
              [
                this.buildSearchObjectWithOR(SearchOBJ),
              ],
          },
        });

        return users;

      } catch (error) {
        // console.error('Error fetching user data:', error.message);
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

    static async getData(attribute, whereClause) {
      try {
        const fixedCondition = { status: 1 };
        const result = await this.findOne({
          attributes: [...attribute],
          where: { ...fixedCondition, ...whereClause }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async checkUser(referred_by) {
      try {
        const result = await this.findOne({
          where: {
            username: referred_by,
            status: 1
          }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async emailOrMobileExists(SearchOBJ) {
      try {
        const userCount = await this.count({
          where: {
            [Op.and]: [
              this.buildSearchObjectWithOR(SearchOBJ),
              { status: 1 },
            ],
          },
        });
        return userCount;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async userExists(mobile, email) {
      try {
        const userCount = await this.count({
          where: {
            mobile: mobile,
            email: email
          }
        });
        return userCount;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


    static async getDataExistance(attribute, whereClause) {
      try {
        const result = await this.findOne({
          attributes: [...attribute],
          where: { ...whereClause }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async GetAllUsers() {
      try {
        const users = await this.findAll({
          where: {
            status: 1
          }
        });
        return users;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


    static async GetAllreferalLevelnotexist() {
      try {
        const rawQuery = `
            SELECT tbl_app_users.*
            FROM tbl_app_users 
            left join tbl_referral_idslevel on tbl_referral_idslevel.user_id=tbl_app_users.id and tbl_referral_idslevel.ref_userid=tbl_app_users.referred_by
            WHERE tbl_app_users.status = 1 and tbl_referral_idslevel.user_id is null 
          `;

        const users = await sequelize.query(rawQuery, {
          type: sequelize.QueryTypes.SELECT,
        });
        return users;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }



    static async updateData(data, id) {
      try {
        // console.log(data);
        const result = await this.update(data, {
          where: { id: id }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async checkMlm(mlm_id) {
      try {
        const userCount = await this.count({
          where: {
            mlm_id: mlm_id
          }
        });
        return userCount;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


    static async getDataExistingUser(attribute, whereClause) {
      try {

        const result = await this.findOne({
          attributes: [...attribute],
          where: { ...whereClause }
        });
        return result;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }

    static async getAllUserCount(whereClause) {
      try {
        const userCount = await this.count({
          where: {
            ...whereClause
          }
        });
        return userCount;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }


  }

  user.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    referred_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mlm_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    mobile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postOfficeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    circle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    block: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_verified: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mobile_verified: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email_verification_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email_verification_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_reset_string: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password_reset_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_on: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified_on: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted_on: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aniversary_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    mpin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_admin: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    instagram_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_old_fetched: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    old_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    inactive_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_portfolio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_levelincome: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    client_id: {
      type: DataTypes.BIGINT,   // matches your DB BIGINT
      allowNull: false,
      unique: true
    },
    secret_key: {
      type: DataTypes.TEXT,     // matches your DB TEXT
      allowNull: false
    }




  }, {
    sequelize,
    modelName: 'user',
    tableName: 'tbl_app_users', // specify table name here
    timestamps: false
  });

  return user;
}


