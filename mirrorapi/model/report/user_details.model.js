// Define the Countries model
const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class userDetail extends Model {
        
        
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
      
      static async getTotalPrime(){
        const primeCount = await this.findOne({
          attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],

          where: {
            
            plan_name: 'prime' // Adjust this based on your actual success status
        }

        });

        return primeCount?.dataValues.num || 0;
      }

      static async getTodayPrime() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0); // Start of today
    
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999); // End of today
    
        const primeCount = await this.findOne({
            attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']],
            where: {
                created_on: {
                    [Op.between]: [todayStart, todayEnd]
                },
                plan_name: 'prime' // Adjust this based on your actual success status
            }
        });
    
        return primeCount?.dataValues.num || 0;
        }

    }

    userDetail.init({
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
              allowNull: false
          },
           state_id: {
              type: DataTypes.INTEGER,
              allowNull: false
          },
            city_id: {
              type: DataTypes.INTEGER,
              allowNull: false
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
              type: DataTypes.DATE,
              allowNull: true
          },
          registration_date: {
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
          ref_mlm_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
            },
            ref_first_name: {
            type: DataTypes.STRING,
            allowNull: false
            },
            ref_last_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ref_username: {
              type: DataTypes.STRING,
              allowNull: false,
              unique:true
              },
              ref_email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique:true
            },
            ref_mobile: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique:true
            },
            ref_dob: {
                type: DataTypes.STRING,
                allowNull: false
            },
            wallet_balance: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            prime_balance: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            cashback_balance: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            plan_name:{
                type: DataTypes.STRING,
                allowNull: true
            },
            plan_amount:{
              type: DataTypes.DOUBLE,
              allowNull: true
            },
            ref_plan_name:{
              type: DataTypes.STRING,
              allowNull: true
            },
            ref_plan_amount:{
              type: DataTypes.DOUBLE,
              allowNull: true
            },
            instagram_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            inactive_reason: {
                type: DataTypes.TEXT,
                allowNull: true
            },
             is_prime: {
              type: DataTypes.INTEGER,
              allowNull: true
            },
            rank: {
                type: DataTypes.STRING,
                allowNull: true
            },
            is_portfolio: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
         
     }, {
        sequelize, 
        modelName: 'userDetail',
        tableName: 'view_user_details', // specify table name here
        timestamps: false
      });
      
      return userDetail;
}


