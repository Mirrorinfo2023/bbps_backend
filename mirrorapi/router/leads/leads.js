const express = require('express');
const leadController = require('../../controller/leads/lead.controller');
const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');
const { configureMulter } = require('../../utility/upload.utility'); 
const lead = express.Router();

const destinationPath = 'uploads/leads';

//const destinationPath = './uploads/leads';
const fileUpload = configureMulter(destinationPath).any();


const endpoints = {
    '/add-leads': '10a78732662e6299231a65fe6be9e08bc537ecf1',
    '/get-leads': '2d15307da7beab814cc1ef3876d808ee8178bfe7',
    '/add-leads-details': '15640d0727b942369e83c198e10ca042b76d4b2c',
    '/get-leads-details': '6d63c61c58f679360daf5e77e24ae74bd3276ba8',
    '/get-leads-report': 'c3af2ca27c1a9974f0992979b447bdba908be445',
    '/get-leads-details-report': '15f2b6f56c3b0cea91ead9b830b6082ffc6e911f',
    
    '/track-lead-user': 'f51f84519e9404300f57176405f976e04fcc6dc8',
    '/get-track-lead-user-report': '1582360c573208f5a3fa685729b391b6eb83be8e',
    '/update-lead-status': '5347b404e605b74879630f9d7f8e6dc58e1b6b7b',
  
  
    '/get-lead-admin': '1debc1a3b74175746b59efe26c5149a71356c6f0',
    '/update-status': 'c47742a47f95494d4ae9f39171b1900745c703df',
    '/update-lead': '70e32f5e2d2e48b2a4e2706e5860eb214ae59f65',
	'/my-leads': '529f4103052b2aec30c1be5c3a57a0caa1f62533',
	'/pending-leads': '57f084c83f23e59768b8555ce508a1765fd9a2df',
	'/user-leads-remarks': 'c52ac431663fca4f09caa4086a4aa01a8a37700c',
	'/lead-form-submit': '40b0d4a2b90eb5ad17c39ec5e08d0f9eea07744d',
    '/lead-histroy': '93ba84dcc72d9788f221c154c9a211423c5cb10c',
	'/lead-earning': 'b768e34f34f7512b4e1b39a3072800f81c3ca32d',
	'lead-user-action': 'c364c67f15d12763cb6578efb65240f5d4e37226'
};

lead.post('/10a78732662e6299231a65fe6be9e08bc537ecf1',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	
	const fileName = req.file.filename;
	leadController.addLead(fileName, req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting add leads:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

lead.post('/2d15307da7beab814cc1ef3876d808ee8178bfe7', authenticateJWT, logMiddleware, async (req, res) => {
	leadController.getLeads(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


lead.post('/15640d0727b942369e83c198e10ca042b76d4b2c', authenticateJWT, logMiddleware, async (req, res) => {
	leadController.addLeadDetails(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting add lead details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

lead.post('/6d63c61c58f679360daf5e77e24ae74bd3276ba8', authenticateJWT, logMiddleware, async (req, res) => {
	leadController.getLeadDetails(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get leads details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


lead.post('/c3af2ca27c1a9974f0992979b447bdba908be445', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.getLeadReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting lead report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


lead.post('/15f2b6f56c3b0cea91ead9b830b6082ffc6e911f', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.getLeadDetailsReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting lead details report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


lead.post('/f51f84519e9404300f57176405f976e04fcc6dc8', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.getLeadTrackDetails(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Track lead User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


lead.post('/1582360c573208f5a3fa685729b391b6eb83be8e', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.getLeadTrackDetailsReport(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting track lead user report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

});


lead.post('/5347b404e605b74879630f9d7f8e6dc58e1b6b7b', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.updateLeadsStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting update Lead status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});


lead.post('/1debc1a3b74175746b59efe26c5149a71356c6f0', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.getSeletedLeadsAdmin(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting get Lead admin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});

lead.post('/c47742a47f95494d4ae9f39171b1900745c703df', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.updateStatus(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});

lead.post('/70e32f5e2d2e48b2a4e2706e5860eb214ae59f65',fileUpload, authenticateJWT, logMiddleware, async (req, res) => {
	let file;

	if (req.file) {
         file = req.file.filename;
    } else {
         file = null;
    }
	const fileName = file;
	leadController.updateLead(fileName,req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting Update Lead:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
	
});





lead.post('/529f4103052b2aec30c1be5c3a57a0caa1f62533', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.pendingLeads(req.body,res).then(data => res.json(data));
});


lead.post('/57f084c83f23e59768b8555ce508a1765fd9a2df', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.pendingLeads(req.body,res).then(data => res.json(data));
});


lead.post('/c52ac431663fca4f09caa4086a4aa01a8a37700c', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.userLeadRemarks(req.body,res).then(data => res.json(data));
});


lead.post('/40b0d4a2b90eb5ad17c39ec5e08d0f9eea07744d', authenticateJWT, logMiddleware, async (req, res) => {
	
	leadController.userform(req.body,res).then(data => res.json(data));
});

lead.post('/93ba84dcc72d9788f221c154c9a211423c5cb10c', authenticateJWT, logMiddleware, async (req, res) => {
	leadController.leadsHistory(req.body,res).then(data => res.json(data));
});

lead.post('/b768e34f34f7512b4e1b39a3072800f81c3ca32d', authenticateJWT, logMiddleware, async (req, res) => {
	leadController.LeadsEarningHistory(req.body,res).then(data => res.json(data));
});



lead.post('/c364c67f15d12763cb6578efb65240f5d4e37226', async (req, res) => {
	
	leadController.lead_user_action(req.body,res)
	    .then(data => res.json(data))
	    .catch(error => {
            console.error('Error requesting for lead action:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });

});




lead.post('/add-leads',fileUpload, async (req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}

	leadController.addLead(fileName, fileNames, req.body,res).then(data => res.json(data));
});

lead.post('/get-leads', async (req, res) => {
	leadController.getLeads(req.body,res).then(data => res.json(data));
});


lead.post('/add-leads-details', async (req, res) => {
	leadController.addLeadDetails(req.body,res).then(data => res.json(data));
});

lead.post('/get-leads-details', async (req, res) => {
	leadController.getLeadDetails(req.body,res).then(data => res.json(data));
});


lead.post('/get-leads-report', async (req, res) => {
	
	leadController.getLeadReport(req.body,res).then(data => res.json(data));
});


lead.post('/update-leads',fileUpload, async (req, res) => {
	let fileName = '';
	let fileNames = '';

	if (req.files) {
		if (req.files.length === 1) {
			fileName = req.files[0].filename;
		} else if (req.files.length > 1) {
			fileNames = req.files.map(file => file.filename);		
		}
	}
	leadController.updateLead(fileName, fileNames, req.body,res).then(data => res.json(data));
});


lead.post('/update-lead-status', async (req, res) => {
	
	leadController.updateLeadStatus(req.body,res).then(data => res.json(data));
});


lead.post('/lead-user-action', async (req, res) => {
	
	leadController.lead_user_action(req.body,res).then(data => res.json(data));
});

lead.post('/lead-user-action-report', async (req, res) => {
	
	leadController.getLeadUserActionReport(req.body,res).then(data => res.json(data));
});

lead.post('/update-user-action-status', async (req, res) => {
	
	leadController.updateLeadUserAction(req.body,res).then(data => res.json(data));
});

lead.post('/get-leads-details-report', async (req, res) => {
	
	leadController.getLeadDetailsReport(req.body,res).then(data => res.json(data));
});

lead.post('/track-lead-user', async (req, res) => {
	
	leadController.getLeadTrackDetails(req.body,res).then(data => res.json(data));
});


lead.post('/get-track-lead-user-report', async (req, res) => {
	
	leadController.getLeadTrackDetailsReport(req.body,res).then(data => res.json(data));

});


lead.post('/my-leads', async (req, res) => {
	
	leadController.pendingLeads(req.body,res).then(data => res.json(data));
});


lead.post('/pending-leads', async (req, res) => {
	
	leadController.pendingLeads(req.body,res).then(data => res.json(data));
});

// lead.post('/update-lead-status', async (req, res) => {
	
// 	leadController.updateLeadsStatus(req.body,res).then(data => res.json(data));
	
// });

lead.post('/user-leads-remarks', async (req, res) => {
	
	leadController.userLeadRemarks(req.body,res).then(data => res.json(data));
});


lead.post('/lead-form-submit', async (req, res) => {
	
	leadController.userform(req.body,res).then(data => res.json(data));
});

lead.post('/lead-histroy', async (req, res) => {
	leadController.leadsHistory(req.body,res).then(data => res.json(data));
});

lead.post('/lead-earning', async (req, res) => {
	leadController.LeadsEarningHistory(req.body,res).then(data => res.json(data));
});


lead.post('/lead-form-data', async (req, res) => {
	
	leadController.getUserformReport(req.body,res).then(data => res.json(data));
});

lead.post('/get-form-data', async (req, res) => {
	
	leadController.getUserformData(req.body,res).then(data => res.json(data));
});

module.exports = lead;
