const { connect, config } = require('../../config/db.config');

class MarketingController {
    db = {};

    constructor() {
        this.db = connect();
        this.initializeDatabase();
    }

    initializeDatabase = async () => {
        try {
            console.log('Initializing database connection...');
            this.db = await connect();

            // Test the connection
            await this.db.sequelize.authenticate();

            // Sync only the Slab and UserSlabStatus models
            await this.db.marketing_content.sync({ force: false });
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

    // Insert new marketing content
    insertMarketingContent = async (req, res) => {
        try {
            await this.waitForInitialization();
            const { title, body, type, templateType, created_by } = req.body;

            if (!title || !body || !type || !templateType) {
                return res.status(400).json({
                    success: false,
                    message: "Fields title, body, type, and templateType are required."
                });
            }

            const newContent = await this.db.marketing_content.insertData({
                title,
                body,
                type,
                templateType,
                created_by
            });

            return res.status(201).json({
                success: true,
                message: "Marketing content added successfully.",
                data: newContent
            });
        } catch (error) {
            console.error("Insert Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to add marketing content",
                error: error.message
            });
        }
    };

    // Get all active marketing content
    getAllMarketingContent = async (req, res) => {
        try {
            await this.waitForInitialization();
            const contents = await this.db.marketing_content.findAll({
                where: { status: 1 },
                order: [['created_on', 'DESC']]
            });

            return res.status(200).json({
                success: true,
                data: contents
            });
        } catch (error) {
            console.error("Fetch All Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch marketing content",
                error: error.message
            });
        }
    };

    // Get marketing content by templateType
    getByTemplateType = async (req, res) => {
        try {
            await this.waitForInitialization();
            const { templateType } = req.params;

            const contents = await this.db.marketing_content.findAll({
                where: { status: 1, templateType },
                order: [['created_on', 'DESC']]
            });

            return res.status(200).json({
                success: true,
                data: contents
            });
        } catch (error) {
            console.error("Fetch by TemplateType Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch by templateType",
                error: error.message
            });
        }
    };

    //Get marketing content by type
    getByType = async (req, res) => {
        try {

            const { type } = req.params;
            await this.waitForInitialization();
            const contents = await this.db.marketing_content.findAll({
                where: { status: 1, type },
                order: [['created_on', 'DESC']]
            });

            return res.status(200).json({
                success: true,
                data: contents
            });
        } catch (error) {
            console.error("Fetch by Type Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch by type",
                error: error.message
            });
        }
    };

    // Get grouped data using custom getData()
    getGroupedData = async (req, res) => {
        try {
            const { attributes, where } = req.body;
            await this.waitForInitialization();
            if (!attributes || !Array.isArray(attributes)) {
                return res.status(400).json({
                    success: false,
                    message: "Attributes must be an array."
                });
            }

            const data = await this.db.marketing_content.getData(attributes, where || {});

            return res.status(200).json({
                success: true,
                data
            });
        } catch (error) {
            console.error("Fetch Grouped Data Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch grouped data",
                error: error.message
            });
        }
    };

    // Update marketing content by id
    updateMarketingContent = async (req, res) => {
        try {
            await this.waitForInitialization();

            const { id } = req.params;
            const { title, body, type, templateType, status } = req.body;

            const content = await this.db.marketing_content.findByPk(id);

            if (!content) {
                return res.status(404).json({
                    success: false,
                    message: `Marketing content with id ${id} not found.`
                });
            }

            await content.update({
                title: title ?? content.title,
                body: body ?? content.body,
                type: type ?? content.type,
                templateType: templateType ?? content.templateType,
                status: status ?? content.status
            });

            return res.status(200).json({
                success: true,
                message: "Marketing content updated successfully.",
                data: content
            });
        } catch (error) {
            console.error("Update Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to update marketing content",
                error: error.message
            });
        }
    };

    deleteMarketingContent = async (req, res) => {
        try {
            await this.waitForInitialization();

            const { id } = req.params;

            const deleted = await this.db.marketing_content.destroy({
                where: { id }
            });

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: `Marketing content with id ${id} not found.`
                });
            }

            return res.status(200).json({
                success: true,
                message: "Marketing content permanently deleted."
            });
        } catch (error) {
            console.error("Delete Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to delete marketing content",
                error: error.message
            });
        }
    };


}

module.exports = new MarketingController();
