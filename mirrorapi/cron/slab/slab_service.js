const { connect } = require('../../config/db.config');

class SlabService {
    db = null;
    isInitialized = false;

    constructor() {
        this.initializeDatabase();
    }

    // Initialize database and sync all models
    initializeDatabase = async () => {
        try {
            console.log('Initializing database connection...');
            this.db = await connect();
            
            // Test the connection
            await this.db.sequelize.authenticate();
            console.log('Database connection established successfully.');

            // Sync only the Slab and UserSlabStatus models
            await this.db.Slab.sync({ force: false });
            await this.db.UserSlabStatus.sync({ force: false });
            console.log('Slab tables synchronized successfully');

            this.isInitialized = true;
        } catch (error) {
            console.error('Error synchronizing database:', error);
            throw error;
        }
    };

    // Wait for initialization to complete
    waitForInitialization = async () => {
        while (!this.isInitialized) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    };

    addSlab = async (slabData) => {
        try {
            await this.waitForInitialization();
            const newSlab = await this.db.Slab.create(slabData);
            return newSlab;
        } catch (error) {
            console.error('Error adding slab:', error);
            throw error;
        }
    };

    // Assign user to the first slab dynamically
    addUserToFirstSlab = async (userId) => {
        try {
            await this.waitForInitialization();

            // Fetch the first slab
            let firstSlab = await this.db.Slab.findOne({
                order: [['interval_days', 'ASC']]
            });

            // If no slabs exist, create default slabs
            if (!firstSlab) {
                const defaultSlabs = [
                    { name: '15 Days', interval_days: 15 },
                    { name: '1 Month', interval_days: 30 },
                    { name: '2 Months', interval_days: 60 },
                    { name: '3 Months', interval_days: 90 },
                    { name: '4 Months', interval_days: 120 },
                    { name: '5 Months', interval_days: 150 },
                    { name: '6 Months', interval_days: 180 },
                    { name: '7 Months', interval_days: 210 },
                    { name: '8 Months', interval_days: 240 },
                    { name: '9 Months', interval_days: 270 },
                    { name: '10 Months', interval_days: 300 },
                    { name: '11 Months', interval_days: 330 },
                    { name: '12 Months', interval_days: 360 },
                ];

                await this.db.Slab.bulkCreate(defaultSlabs);
                // Re-fetch the first slab
                firstSlab = await this.db.Slab.findOne({
                    order: [['interval_days', 'ASC']]
                });
            }

            // Check if user already has a slab
            const existing = await this.db.UserSlabStatus.findOne({
                where: { user_id: userId, completed: false }
            });
            if (existing) throw new Error('User already assigned to a slab');

            // Assign user to the first slab
            await this.db.UserSlabStatus.create({
                user_id: userId,
                slab_id: firstSlab.id,
                start_date: new Date(),
                next_message_date: new Date(Date.now() + firstSlab.interval_days * 24 * 60 * 60 * 1000)
            });

        } catch (error) {
            console.error('Error adding user to first slab:', error);
            throw error;
        }
    };


    // Move user to next slab after current one is completed
    moveToNextSlab = async (userStatus) => {
        try {
            await this.waitForInitialization();
            const currentSlab = await this.db.Slab.findByPk(userStatus.slab_id);
            if (!currentSlab) throw new Error('Current slab not found');

            const nextSlab = await this.db.Slab.findOne({
                where: { interval_days: { [this.db.Op.gt]: currentSlab.interval_days } },
                order: [['interval_days', 'ASC']]
            });

            if (!nextSlab) {
                console.log(`No next slab found for user ${userStatus.user_id}`);
                return;
            }

            const t = await this.db.sequelize.transaction();
            try {
                // Mark old slab as completed
                await userStatus.update({ completed: true }, { transaction: t });

                // Assign next slab
                await this.db.UserSlabStatus.create({
                    user_id: userStatus.user_id,
                    slab_id: nextSlab.id,
                    start_date: new Date(),
                    next_message_date: new Date(Date.now() + nextSlab.interval_days * 24 * 60 * 60 * 1000)
                }, { transaction: t });

                await t.commit();
            } catch (error) {
                await t.rollback();
                throw error;
            }
        } catch (error) {
            console.error('Error moving to next slab:', error);
            throw error;
        }
    };

    // Fetch users whose next_message_date is due
    getDueUsers = async () => {
        try {
            await this.waitForInitialization();
            const today = new Date();
            return await this.db.UserSlabStatus.findAll({
                where: {
                    next_message_date: { [this.db.Op.lte]: today },
                    completed: false
                }
            });
        } catch (error) {
            console.error('Error getting due users:', error);
            throw error;
        }
    };
}

module.exports = new SlabService();