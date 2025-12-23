const express = require('express');
const royalityController = require('../../controller/royality/royality.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const royality = express.Router();



const endpoints = {
    '/shoot-royality': '9d1ec73847fda1895e3d22ecb192cd24cf62c3cf',
    '/PrimeRoyality': 'a389cd5338cddea751ee1232e71b577d3b69bf1f',
     '/RoyalityRank': 'e34968ffae8d9435b55986676dd62e722fbd4268',
     'stop-royality-user':'0092d0523684c13371fa7b8b47eb64953510c3c3',
       'RoyalityReport':'63a14cf5d75879f5bfe50b7246dcc0ff57c91c71'
     
   
   
    
};


royality.post('/9d1ec73847fda1895e3d22ecb192cd24cf62c3cf',  async (req, res) => {
	royalityController.RankRoyalityCategory(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

royality.post('/a389cd5338cddea751ee1232e71b577d3b69bf1f',  async (req, res) => {
	royalityController.PrimeRoyality(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


royality.post('/e34968ffae8d9435b55986676dd62e722fbd4268',  async (req, res) => {
	royalityController.RoyalityRank(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

royality.post('/0092d0523684c13371fa7b8b47eb64953510c3c3',  async (req, res) => {
	royalityController.updateRoyalityStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

royality.post('/63a14cf5d75879f5bfe50b7246dcc0ff57c91c71',  async (req, res) => {
	royalityController.RoyalityReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting royality :', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



//
module.exports = royality;
