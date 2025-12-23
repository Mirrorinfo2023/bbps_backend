// Define the Countries model

const { Sequelize, Model, DataTypes, Op, sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes, Model) => {

    class meetingDetails extends Model {



        static async getData(attribute, whereCondition) {
            try {
                const result = await this.findOne({
                    attributes: [...attribute],
                    where: whereCondition,

                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getAllData(whereCondition) {
            try {
                const result = await this.findAll({


                    attributes: [
                        'id',
                        'name',
                        'description',
                        'meeting_date',
                        'meeting_time',
                        'meeting_link',
                        'image',
                        'created_by',
                        'status',
                        'modified_by',

                        [Sequelize.fn('date_format', Sequelize.col('created_on'), '%d-%m-%Y %H:%i:%s'), 'created_on'],
                        [Sequelize.fn('date_format', Sequelize.col('modified_on'), '%d-%m-%Y %H:%i:%s'), 'modified_on'],
                    ],

                    where: whereCondition,
                    order: [['created_on', 'DESC']],
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



        static async UpdateData(data, whereClause) {
            try {

                const result = await this.update(data, {
                    where: whereClause
                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }

        static async getUserCount(whereClause) {
            try {
                const result = await this.count({
                    where:
                        whereClause

                });
                return result;
            } catch (error) {
                console.error('Error:', error);
                throw error;
            }
        }






    }



    meetingDetails.init({
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_enroll: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_invite: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_join: {
            type: DataTypes.INTEGER,
            allowNull: false
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



    },
        {
            sequelize,
            modelName: 'meetingDetails',
            tableName: 'tbl_meeting_details', // specify table name here
            timestamps: false
        });

    return meetingDetails;
}


