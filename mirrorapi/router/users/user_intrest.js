const express = require('express');
const userIntrestController = require('../../controller/users/user_intrest.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 



const usersIntrest = express.Router();

const destinationPath = 'uploads/intrest_category/';

const fileUpload = configureMulter(destinationPath).fields([
	{ name: 'panImage', maxCount: 1 },
	{ name: 'aadharImage', maxCount: 1 },
	{ name: 'aadharBackImage', maxCount: 1 },
	{ name: 'chequeBookImage', maxCount: 1 },
	
  ]);



const endpoints = {
    '/get-user-intrest-category': '1ce6d7a711f368ac533706d422de525251c1cbd1',
    '/add-user-intrest': '65bc1ac61a1b3bb3169cd4162e417261515b8500',
};

  usersIntrest.get('/1ce6d7a711f368ac533706d422de525251c1cbd1', logMiddleware, (req, res)  => {
	userIntrestController.getUserIntrestCategory(req,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Intrest Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

usersIntrest.post('/65bc1ac61a1b3bb3169cd4162e417261515b8500', logMiddleware, (req, res)  => {
	userIntrestController.uploadUserIntrest(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting user Intrest:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


usersIntrest.get('/get-user-intrest-category', async (req, res)  => {

	userIntrestController.getUserIntrestCategory(req,res).then(data => res.json(data));
});



usersIntrest.post('/add-user-intrest', async (req, res)  => {

	userIntrestController.uploadUserIntrest(req.body,res).then(data => res.json(data));
});




module.exports = usersIntrest;
