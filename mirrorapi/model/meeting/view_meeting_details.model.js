// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class view_meeting_details extends Model {

        static async getData() {
            const Category = await this.findAll({
            order: [['id', 'DESC']],
            });
            return Category;
        }

        static async getAllData(whereCondition) {
            try {
              const result = await this.findAll({


                attributes: [
                    'id',
                    'meeting_id',
                    'user_id',
                    'name',
                    'description',
                    'meeting_date',
                    'meeting_time',
                    'meeting_link',
                    'image',
                    'first_name',
                    'last_name',
                    'mlm_id',
                    'mobile',
                    'email',
                    'is_enroll',
                    'is_invite',
                    'is_join',
                    'meeting_created_date',
                    'meeting_enroll_date',
                    'meeting_status'
                   
                  ],

                  where: whereCondition,
                  order: [['enroll_created_on', 'DESC']],
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
          }
        


    }

    
    view_meeting_details.init({
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
		  primaryKey: true,
		  autoIncrement: true
        },
        meeting_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id : {
              type: DataTypes.INTEGER,
              allowNull: false
        },
        name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        description : {
            type: DataTypes.TEXT,
            allowNull: false
        },
        meeting_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        meeting_time : {
            type: DataTypes.STRING,
            allowNull: false
        },
        meeting_link: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        enroll_created_on: {
            type: DataTypes.DATE,
            allowNull: true
        },
        first_name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name : {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile:{
            type: DataTypes.STRING,
            allowNull: false
        },
        mlm_id:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
       
        is_enroll : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        meeting_status : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_invite : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_join : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        meeting_created_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        meeting_enroll_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
  
      },
      {
        sequelize, 
        modelName: 'view_meeting_details',
        tableName: 'view_meeting_details', // specify table name here
        timestamps: false
      });
      
      return view_meeting_details;
}


