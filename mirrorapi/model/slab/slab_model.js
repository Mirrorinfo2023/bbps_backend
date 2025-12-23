module.exports = (sequelize, DataTypes, Model) => {
    class Slab extends Model {
        //  Example custom method
        static async getAllSlabs() {
            return await this.findAll({ order: [['interval_days', 'ASC']] });
        }

        static async findFirstSlab() {
            return await this.findOne({ order: [['interval_days', 'ASC']] });
        }
    }

    Slab.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        interval_days: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Slab',
        tableName: 'slabs',
        timestamps: false
    });

    // Associations (if any)
    Slab.associate = function(models) {
        Slab.hasMany(models.UserSlabStatus, { foreignKey: 'slab_id' });
    };

    return Slab;
};
