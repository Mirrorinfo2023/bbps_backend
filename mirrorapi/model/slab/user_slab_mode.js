module.exports = (sequelize, DataTypes) => {
    const UserSlabStatus = sequelize.define('UserSlabStatus', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        slab_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        next_message_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'user_slab_status',
        timestamps: false
    });

    // Associations
    UserSlabStatus.associate = (models) => {
        UserSlabStatus.belongsTo(models.user, {
            foreignKey: 'user_id',
            targetKey: 'id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        UserSlabStatus.belongsTo(models.Slab, {
            foreignKey: 'slab_id',
            targetKey: 'id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });
    };

    return UserSlabStatus;
};
