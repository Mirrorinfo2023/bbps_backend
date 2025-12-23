// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class viewEmployee extends Model {
      

      static async getData(whereClause) {
        try {
            const result = await this.findOne({
            where: {
                ...whereClause
            }
            });
                    
            return result;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getDataCount(whereClause) {
        try {
            const result = await this.count({
                where: {
                    ...whereClause
                }
            });
                    
            return result;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


      static async getAllData(whereClause) {
        try {
            const results = await this.findAll({
                where: {
                    ...whereClause
                },
                order: [['employee_id', 'desc']]
            });
                    
            return results;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
      }


    }


    viewEmployee.init({
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
            unique:true
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
              unique:true
              },
              email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique:true
            },
            mobile: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique:true
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
                allowNull: true
            },
             postOfficeName: {
                type: DataTypes.STRING,
                allowNull: true
            },
              circle: {
                type: DataTypes.STRING,
                allowNull: true
            },
               district: {
                type: DataTypes.STRING,
                allowNull: false
            },
              division: {
                type: DataTypes.STRING,
                allowNull: true
            },
              region: {
                type: DataTypes.STRING,
                allowNull: true
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
                allowNull: true
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
              type: DataTypes.INTEGER,
              allowNull: true
          },
            is_admin: {
              type: DataTypes.INTEGER,
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
            telephone: {
              type: DataTypes.STRING,
              allowNull: true
          },
          gender: {
              type: DataTypes.STRING,
              allowNull: true
          },
          registration_for: {
              type: DataTypes.STRING,
              allowNull: true
          },
          education: {
              type: DataTypes.STRING,
              allowNull: true
          },
          profession: {
              type: DataTypes.STRING,
              allowNull: true
          },
        employee_code:{
            type: DataTypes.STRING,
            allowNull: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        employee_status: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        employee_id: {
            type: DataTypes.BIGINT,
            allowNull: true
          },
          state: {
            type: DataTypes.STRING,
            allowNull: true
          },
          city: {
            type: DataTypes.STRING,
            allowNull: true
          }
  
      },
      {
        sequelize, 
        modelName: 'viewEmployee',
        tableName: 'view_employee', // specify table name here
        timestamps: false
      });
      
      return viewEmployee;
}


