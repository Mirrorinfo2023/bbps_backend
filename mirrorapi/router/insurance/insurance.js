const express = require('express');
const insuranceController = require('../../controller/insurance/insurance.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 


const insurance = express.Router();

const destinationPath = 'uploads/insurance';
const fileUpload = configureMulter(destinationPath).any();


const endpoints = {
    '/add-insurance': 'c98268880c126e5b95e864dd6f1db2411f30cd68',
    '/update-insurance': '7606f026cb85c94187709c98a0ae7bee1ff93979',
    '/get-policy': 'a6581aee75978c8990e6e8a907b4b0efa1d614df',
    '/get-insurance-user-details': '8977cca5e71a7ff213b236b224651c8efacca02f',
    '/get-insurance-user-track-report': 'b02ca79619f3ec5a9c815290aaecd49da3b72586',
};



//******************************************API'S FOR INSUARANCE SQUARE****************************************************************/
insurance.post('/c98268880c126e5b95e864dd6f1db2411f30cd68', fileUpload, authenticateJWT, logMiddleware, (req, res) => {

    let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	insuranceController.addInsurance(fileName, fileNames, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Insurance:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


insurance.post('/get-insurance-history',(req, res) => {

	insuranceController.getInsuranceDetails(req.body,res).then(data => res.json(data));
});

// insurance.post('/7606f026cb85c94187709c98a0ae7bee1ff93979', authenticateJWT, logMiddleware, (req, res) => {

// 	insuranceController.updateInsurance(req.body,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting update Insurance:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

// insurance.post('/a6581aee75978c8990e6e8a907b4b0efa1d614df', authenticateJWT, logMiddleware, (req, res) => {

// 	insuranceController.getPolicyPdf(req.body,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting Get Policy:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

// /******************************************API'S FOR INSUARANCE SQUARE****************************************************************/



// /******************************************API'S FOR INSUARANCE TRACK USER DETAILS*******************************************************/

// insurance.post('/8977cca5e71a7ff213b236b224651c8efacca02f',authenticateJWT, logMiddleware, async(req, res) => {

// 	const userDetails = req.user;
//     const requestData = req.body;
//     const combinedData = {...userDetails,...requestData};
	
// 	insuranceController.getInsuranceUserDetails(combinedData,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting get insurance user details:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });

// insurance.get('/b02ca79619f3ec5a9c815290aaecd49da3b72586', authenticateJWT, logMiddleware, async(req, res) => {

// 	insuranceController.getInsuranceUserDetailsReport(req,res).then(data => res.json(data))
// 	  .catch(error => {
//             console.error('Error requesting insurance track report:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         });
// });




/******************************************API'S FOR INSUARANCE TRACK USER DETAILS*********************************************************/




//******************************************API'S FOR INSUARANCE SQUARE****************************************************************/
insurance.post('/add-insurance', fileUpload, (req, res) => {

	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	
	insuranceController.addInsurance(fileName, fileNames, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Add Insurance:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// insurance.post('/update-insurance',(req, res) => {

// 	insuranceController.updateInsurance(req.body,res).then(data => res.json(data));
// });

// insurance.post('/get-policy',(req, res) => {

// 	insuranceController.getPolicyPdf(req.body,res).then(data => res.json(data));
// });

// /******************************************API'S FOR INSUARANCE SQUARE****************************************************************/



// /******************************************API'S FOR INSUARANCE TRACK USER DETAILS*******************************************************/

// insurance.post('/get-insurance-user-details',authenticateJWT,async(req, res) => {

// 	const userDetails = req.user;
//     const requestData = req.body;
//     const combinedData = {...userDetails,...requestData};
	
// 	insuranceController.getInsuranceUserDetails(combinedData,res).then(data => res.json(data));
// });

// insurance.get('/get-insurance-user-track-report',async(req, res) => {

// 	insuranceController.getInsuranceUserDetailsReport(req,res).then(data => res.json(data));
// });



insurance.post('/get-insurance-report',(req, res) => {

	insuranceController.insurance_data(req.body,res).then(data => res.json(data));
});


/******************************************API'S FOR INSUARANCE TRACK USER DETAILS*********************************************************/




module.exports = insurance;
