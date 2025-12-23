const slabService = require('../../cron/slab/slab_service');

class SlabController {
    constructor() {
        // Initialize the database once when controller is created
        slabService.initializeDatabase()
            .then(() => console.log('Slab table initialized'))
            .catch(err => console.error('Error initializing database:', err));
    }

    static async addSlab(req, res) {
        try {
            const slabData = req.body;

            // Validate required fields
            if (!slabData.name || !slabData.interval_days) {
                return res.status(400).json({ message: 'Name and interval_days are required' });
            }

            const newSlab = await slabService.addSlab(slabData);
            console.log('New slab added:', newSlab.toJSON());

            return res.status(201).json({
                message: 'Slab added successfully',
                slab: newSlab.toJSON() //convert to plain JSON
            });
        } catch (error) {
            console.error('Error adding slab:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = SlabController;
