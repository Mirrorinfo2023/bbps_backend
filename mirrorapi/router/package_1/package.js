const express = require('express');
const packageController = require('../../controller/package/package.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const packages = express.Router();



const endpoints = {
    '/AddPackage': 'fcf270b419b51742e676be61ce846f5bcba40329',
   
   
   
    
};


packages.post('/fcf270b419b51742e676be61ce846f5bcba40329',  async (req, res) => {
	packageController.AddPackage(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
packages.post('/18b22f6d444663a32bf2ece9527dcafa3f428a88',  async (req, res) => {
	packageController.UpdatePackage(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

packages.post('/e073159b050cf66c48230c3ff349c791aa617449',  async (req, res) => {
	packageController.getPackage(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



//
module.exports = packages;
