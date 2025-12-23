const express = require('express');
const graphicsController = require('../../controller/graphics/graphics.controller');
const graphicsCategoryController = require('../../controller/graphics/graphicsCategory.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const graphics = express.Router();

const destinationPath = 'uploads/graphics';
// const destinationPath = './uploads/graphics';
const fileUpload = configureMulter(destinationPath).single('image');

const destinationPath1 = 'uploads/graphics/category';
const fileUpload1 = configureMulter(destinationPath1).single('image');



const endpoints = {
    '/get-graphics-category': 'ee2bbc96d1e8aa95ad3d86b4ef019e944b991769',
    '/add-graphics': 'b4dd76767d52fb0801c6596522188c17ee7ddbcf',
    '/get-graphics': 'e20dd3d5e2dbb23620d2f72a2d5d22b0c58ce9d4',
    '/get-graphics-categorywise': '5b1e268857b9ac47d787bfc320cbca2b9fd156fc',
    '/update-like-share-count': '3e37cbc0fbbc941624e6bfc3f2ffd966bf679dd4',
    '/get-graphics-report': 'efa221ee4312afa5e470066d80b2bcd8dc2a5266',
    '/get-category-list': 'c4c98391befddfd3fbe29ca55b446e4763951b0a',
    '/add-category': 'e8c972c374e0499787cf9a6674ee95ba94e2731f',
    '/update-graphics-category-status': 'b280cf484ac215eb3fda64af255d9117b190404d',
    '/get-category': '006db6cc97a5160392932874bf6539ad2f0caea4',
    '/update-graphics-category': 'ec15edf51a1e70ed107720da25d0e31e6fb56190',
    '/update-graphics-status': '78275d02a0df1a2ca9d6b677676903df74f0072d',
    '/get-graphicsCategoryAdmin': 'fcda3a4b836052cfed69acd8d14ac3b4bce64d15',
        
};



graphics.get('/ee2bbc96d1e8aa95ad3d86b4ef019e944b991769', logMiddleware, authenticateJWT,(req, res) => {

	graphicsController.getGraphicsCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get graphics Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/b4dd76767d52fb0801c6596522188c17ee7ddbcf',fileUpload, authenticateJWT, logMiddleware,async (req, res) => {
	const fileName = req.file.filename;
	graphicsController.addGraphics(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add graphics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/e20dd3d5e2dbb23620d2f72a2d5d22b0c58ce9d4', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsController.getGraphics( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get graphics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/5b1e268857b9ac47d787bfc320cbca2b9fd156fc', authenticateJWT, async (req, res) => {
	
	graphicsController.getGraphicsCategorywise( req.body,res).then(data => res.json(data))
	 .catch(error => {
            console.error('Error requesting get graphics categorywise:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/3e37cbc0fbbc941624e6bfc3f2ffd966bf679dd4', authenticateJWT, logMiddleware,async (req, res) => {
	
	graphicsController.updateLikeShareCount( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update likeshare count:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/efa221ee4312afa5e470066d80b2bcd8dc2a5266', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsController.graphicsList( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Graphics Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



graphics.post('/c4c98391befddfd3fbe29ca55b446e4763951b0a', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsCategoryController.getCategoryList( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting category List:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/e8c972c374e0499787cf9a6674ee95ba94e2731f',fileUpload1, authenticateJWT, logMiddleware, async (req, res) => {
	const fileName = req.file.filename;
	graphicsCategoryController.addCategory(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

graphics.post('/b280cf484ac215eb3fda64af255d9117b190404d', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsCategoryController.updateCategoryStatus( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update category status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

graphics.post('/006db6cc97a5160392932874bf6539ad2f0caea4', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsCategoryController.getGraphicsCategory( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get graphics category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/ec15edf51a1e70ed107720da25d0e31e6fb56190',fileUpload1, authenticateJWT, logMiddleware, async (req, res) => {
	const fileName = req.file.filename;
	graphicsCategoryController.updateGraphicsCategory(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update graphics category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


graphics.post('/78275d02a0df1a2ca9d6b677676903df74f0072d', authenticateJWT, logMiddleware, async (req, res) => {
	
	graphicsController.updateGraphicsStatus( req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update graphics status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

graphics.get('/fcda3a4b836052cfed69acd8d14ac3b4bce64d15', authenticateJWT, logMiddleware, (req, res) => {
	graphicsCategoryController.getGraphicsCategoryAdmin(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get graphics category admin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});





graphics.get('/get-graphics-category',(req, res) => {

	graphicsController.getGraphicsCategory(req.body,res).then(data => res.json(data));
});


graphics.post('/add-graphics',fileUpload, logMiddleware,async (req, res) => {
	const fileName = req.file.filename;
	graphicsController.addGraphics(fileName, req.body,res).then(data => res.json(data));
});


graphics.post('/get-graphics', logMiddleware, async (req, res) => {
	
	graphicsController.getGraphics( req.body,res).then(data => res.json(data));
});


graphics.post('/get-graphics-categorywise', async (req, res) => {
	
	graphicsController.getGraphicsCategorywise( req.body,res).then(data => res.json(data));
});


graphics.post('/update-like-share-count', logMiddleware,async (req, res) => {
	
	graphicsController.updateLikeShareCount( req.body,res).then(data => res.json(data));
});


graphics.post('/get-graphics-report', async (req, res) => {
	
	graphicsController.graphicsList( req.body,res).then(data => res.json(data));
});



graphics.post('/get-category-list', async (req, res) => {
	
	graphicsCategoryController.getCategoryList( req.body,res).then(data => res.json(data));
});


graphics.post('/add-category',fileUpload1, async (req, res) => {
	const fileName = req.file.filename;
	graphicsCategoryController.addCategory(fileName, req.body,res).then(data => res.json(data));
});

graphics.post('/update-graphics-category-status', async (req, res) => {
	
	graphicsCategoryController.updateCategoryStatus( req.body,res).then(data => res.json(data));
});

graphics.post('/get-category', async (req, res) => {
	
	graphicsCategoryController.getGraphicsCategory( req.body,res).then(data => res.json(data));
});


graphics.post('/update-graphics-category',fileUpload1, async (req, res) => {
	const fileName = req.file.filename;
	graphicsCategoryController.updateGraphicsCategory(fileName, req.body,res).then(data => res.json(data));
});


graphics.post('/update-graphics-status', async (req, res) => {
	
	graphicsController.updateGraphicsStatus( req.body,res).then(data => res.json(data));
});

graphics.get('/get-graphicsCategoryAdmin',(req, res) => {
	graphicsCategoryController.getGraphicsCategoryAdmin(req.body,res).then(data => res.json(data));
});




module.exports = graphics;
