// Define the Countries model
module.exports = (sequelize, DataTypes, Model,Op) => {

    class partner extends Model {
    
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
     static async  getUserSearchByData(SearchOBJ) {
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
    
     static async  getUserSearchByDataWithOR(SearchOBJ) {
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
    
     static async  getUserSearchByDataWithORStatus(SearchOBJ) {
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
          const fixedCondition = {status: 1};
          const result = await this.findOne({
            attributes: [...attribute],
            where: {...fixedCondition, ...whereClause}
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
            where: {...whereClause}
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
      
      

      static async updateData(data,id) {
        try {
          // console.log(data);
          const result = await this.update(data, {
            where: { id :id }
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
            where: { ...whereClause}
          });
          return result;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }

      
    }

    partner.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },

        company_code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        mobile: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique:true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pincode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
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
        access_token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        working_key: {
          type: DataTypes.STRING,
          allowNull: true
        }, 
        short_name: {
          type: DataTypes.STRING,
          allowNull: true
        }, 
          
     }, {
        sequelize, 
        modelName: 'partner',
        tableName: 'tbl_users', // specify table name here
        timestamps: false
      });
      
      return partner;
}


