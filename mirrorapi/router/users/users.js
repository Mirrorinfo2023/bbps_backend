const express = require('express');
const loginController = require('../../controller/users/login.controller');
const registerController = require('../../controller/users/register.controller');
const resetController = require('../../controller/users/reset.controller');
const mpinController = require('../../controller/users/mpin.controller');
const oldIncomeController = require('../../controller/users/get_old_income.controller');
const QrGenerateController = require('../../controller/users/qrGenerate.controller');
const dashboardController = require('../../controller/users/dashboard.controller');
const idCardController = require('../../controller/users/idCard.controller');
const path = require("path");
const uploadFileToB2 = require('../../utility/b2Upload.utility'); // new B2 uploader
// const cronController = require('../../cron/orders/order.cron');

const authenticateJWT = require('../../middleware/authMiddleware');
const logMiddleware = require('../../middleware/logMiddleware');

const kycController = require('../../controller/users/kyc.controller');
const { configureMulter } = require('../../utility/upload.utility');

const routerurl = require('../../config/routerurl.config');
// const routerurl = require('../../config/encrypturl.config');
const urlRouter = routerurl.routerUrl();

const users = express.Router();
const multer = require("multer");

// Memory storage so files are kept in buffer for B2 upload
const storage = multer.memoryStorage();

const fileUpload = configureMulter((req) => {
    const userId = req.body.user_id || req.user?.id;
    console.log("userId is", req.body)
    if (!userId) throw new Error("User ID is required");

    // Path at project root: /uploads/kyc/{userId}
    return path.join(process.cwd(), "uploads/kyc", userId.toString());
}).fields([
    { name: "panImage", maxCount: 1 },
    { name: "aadharImage", maxCount: 1 },
    { name: "aadharBackImage", maxCount: 1 },
    { name: "chequeBookImage", maxCount: 1 },
]);

const destinationPath1 = 'uploads/user';
const fileUpload1 = configureMulter(destinationPath1).single('img');


const endpoints = {
    '/login': '2736fab291f04e69b62d490c3c09361f5b82461a',
    '/admin_login': '4e22b047986b40e5018b04a71c7df2e04893f2d3',
    '/register': '13a2828b3adecc1c32ea3888d08afa51e147b3f3',
    '/reffer-by': '9a82bc2234a56504434ce88e3ab2a11f34b0dcc8',
    '/get-user-details': '8f3457ae01ceba087cf9790ab03e62a6035bd460',
    '/reset-password': 'd1a207b38c8b705457e740a084bcf96d959ea01e',
    '/get-mpin': 'f0a52c7bd4f59cc75f2be2ead939ffa1adda3441',
    '/upload-kyc': '550ecdddb5b8b023dda91594810884c12456d0a3',
    '/get-kyc': 'b8e015dd1c79a227c4cb1ceefaf8e3ab2a79665f',
    '/get-kyc-report': '421abbe46f1f142bd142def0e11ad9f7433adad6',
    '/update-kyc-status': 'c554430d8f155abbaa1ee9c2dbaf8adb95c8132f',
    '/update-user-status': '7e0f025e644befa1fce101beb075a6acc6360b16',
    '/get-profile': '63c6ad33e3395d611c35ed9ef749fd8fe4ae2bb4',
    '/update-user-profile': '978d91c8d62d882a00631e74fa6c6863616ebc13',
    '/update-profile-userinfo': '7b02c64a0be08761645414bcc7fdbc8e583fbce3',
    '/get-profile-userinfo': '68ddfd064d1bf11ab6689399a70908c993fd11b9',
    '/reset-mpin': '73c0a707a700129fd2b4f7cb4b982d3a549904b1',
    '/get-user-old-income': 'ec6019ea7e315629cee41fc1ec0fa87d90827d35',
    '/check-old-income-exists': 'f3fe0b8f30dd498bce7cabe83acc00722db55006',
    '/credit-debit-income-to-user': 'd7dfaf86f2ab8c7013f268736ab747e07bd8558e',
    '/admin-reset-password': '1c3bb4525d626c9fabed22789ba34ec12e097222',
    '/update-user-info-admin': '663afe0b50d03001ceafa9c3634cf0f91235d041',
    '/check-mobileOrEmail-admin': '582c2220d0291f82c235404e6e399821ed67c43f',
    '/update-kyc': '94ca940072d5ffe21b2b9d922e08617399be3d1f',
    '/get-qrcode': 'e2eea9ffa100bbd9b7e3ef2b0bafb8f59920cea8',
    '/unblock-user': '77651f481820ee7a6d33dfde4579d48715f0d1d9',
    '/go-to-shop': '262206799e879277961403f83d477c5e70da8dfc',
    '/deactivate-user': '2f1152a7869df19b1a583f4a971291ddcf413ce3',
    '/get-dashboard-summary': '8bf258dbc185162d62688ccca1c730a97097e903',
    'idcard-purchase': '14230cdae5a3d15697bc8f40f03d2efb6e52865c',
    'loginTes': '14230cdae5a3d15697bc8f40f65c',

};


users.post(
    '/550ecdddb5b8b023dda91594810884c12456d0a3',
    fileUpload,
    async (req, res) => {
        try {
            // Directly pass files + body to controller
            const response = await kycController.uploadKyc(req.files, req.body);
            res.status(response.status).json(response);
        } catch (err) {
            console.error("KYC Upload Error:", err);
            res.status(500).json({ status: 500, message: "KYC Upload Failed" });
        }
    }
);




//Login
users.post('/2736fab291f04e69b62d490c3c09361f5b82461a', logMiddleware, async (req, res) => {
    loginController.login(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Admin Login
users.post('/4e22b047986b40e5018b04a71c7df2e04893f2d3', logMiddleware, (req, res) => {

    loginController.admin_login(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Admin Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Register
users.post('/13a2828b3adecc1c32ea3888d08afa51e147b3f3', logMiddleware, (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.register(req.body, res, ipAddress)
         
        .catch(error => {
            console.error('Error requesting Register:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


users.post('/investment', logMiddleware, (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.investment(req.body, res, ipAddress)
         
        .catch(error => {
            console.error('Error requesting Register:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


//Reffer By
users.post('/9a82bc2234a56504434ce88e3ab2a11f34b0dcc8', logMiddleware, (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.refferedBy(req.body, res, ipAddress)
         
        .catch(error => {
            console.error('Error requesting Reffer By:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Get User Details
users.post('/8f3457ae01ceba087cf9790ab03e62a6035bd460', authenticateJWT, logMiddleware, (req, res) => {
    registerController.getUserDetails(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get User Deatils:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Rest Password
users.post('/d1a207b38c8b705457e740a084bcf96d959ea01e', logMiddleware, (req, res) => {

    resetController.resetPassword(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Reset Password:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Get MPIN
users.post('/f0a52c7bd4f59cc75f2be2ead939ffa1adda3441', logMiddleware, (req, res) => {

    mpinController.getMpin(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get Mpin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Upload Kyc
// users.post(
//     "/550ecdddb5b8b023dda91594810884c12456d0a3",
//     fileUpload,           // multer
//     logMiddleware,        // logging
//     async (req, res) => {
//         try {
//             // Safely extract files
//             const panImage = req.files?.["panImage"]?.[0]?.filename || null;
//             const aadharImage = req.files?.["aadharImage"]?.[0]?.filename || null;
//             const aadharBackImage = req.files?.["aadharBackImage"]?.[0]?.filename || null;
//             const chequeBookImage = req.files?.["chequeBookImage"]?.[0]?.filename || null;

//             // Log for debugging
//             console.log("Body from frontend:", req.body);
//             console.log("Files received:", {
//                 panImage,
//                 aadharImage,
//                 aadharBackImage,
//                 chequeBookImage,
//             });

//             // Call controller
//             const data = await kycController.uploadKyc(
//                 panImage,
//                 aadharImage,
//                 aadharBackImage,
//                 chequeBookImage,
//                 req
//             );

//             res.status(200).json({
//                 status: 200,
//                 message: "KYC uploaded successfully",
//                 data,
//             });
//         } catch (error) {
//             console.error("Error uploading KYC:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// );




// users.post(
//     "/550ecdddb5b8b023dda91594810884c12456d0a3",
//     fileUpload,
//     async (req, res) => {
//         try {
//             const userId = req.body.user_id;

//             // 🔹 Upload each file to B2 (if present)
//             const panImage =
//                 req.files?.panImage?.[0] &&
//                 (await uploadKycImage(userId, req.files.panImage[0]));
//             const aadharImage =
//                 req.files?.aadharImage?.[0] &&
//                 (await uploadKycImage(userId, req.files.aadharImage[0]));
//             const aadharBackImage =
//                 req.files?.aadharBackImage?.[0] &&
//                 (await uploadKycImage(userId, req.files.aadharBackImage[0]));
//             const chequeBookImage =
//                 req.files?.chequeBookImage?.[0] &&
//                 (await uploadKycImage(userId, req.files.chequeBookImage[0]));

//             // 🔹 Pass download URLs to DB
//             const data = await kycController.uploadKyc(
//                 panImage?.downloadUrl || null,
//                 aadharImage?.downloadUrl || null,
//                 aadharBackImage?.downloadUrl || null,
//                 chequeBookImage?.downloadUrl || null,
//                 req.body
//             );

//             res.json({ status: 200, message: "KYC uploaded successfully", data });
//         } catch (error) {
//             console.error("Error uploading KYC:", error);
//             res.status(500).json({ error: "Internal Server Error" });
//         }
//     }
// );

// Get Kyc
users.post('/b8e015dd1c79a227c4cb1ceefaf8e3ab2a79665f', authenticateJWT, logMiddleware, async (req, res) => {

    kycController.getKyc(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get Kyc:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



//Get KYC Report
users.post('/421abbe46f1f142bd142def0e11ad9f7433adad6', authenticateJWT, logMiddleware, async (req, res) => {

    kycController.getKycReport(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get Kyc Report:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Update Kyc status
users.post('/c554430d8f155abbaa1ee9c2dbaf8adb95c8132f', authenticateJWT, logMiddleware, async (req, res) => {

    kycController.updateKycStatus(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Update Kyc Status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Update user status
users.post('/7e0f025e644befa1fce101beb075a6acc6360b16', authenticateJWT, logMiddleware, async (req, res) => {

    loginController.updateUserStatus(req.body, res) 
        .catch(error => {
            console.error('Error requesting Update User Status:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Get Profile
users.post('/63c6ad33e3395d611c35ed9ef749fd8fe4ae2bb4', authenticateJWT, logMiddleware, async (req, res) => {

    loginController.getProfile(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get Profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//update user profile
users.post('/978d91c8d62d882a00631e74fa6c6863616ebc13', fileUpload1, authenticateJWT, logMiddleware, async (req, res) => {

    let file;
    if (req.file) {
        file = req.file.filename;
    } else {
        file = null;
    }
    const fileName = file;
    loginController.updateProfile(fileName, req.body, res)
         
        .catch(error => {
            console.error('Error requesting Update User Profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//Update profile user info
users.post('/7b02c64a0be08761645414bcc7fdbc8e583fbce3', authenticateJWT, logMiddleware, async (req, res) => {

    loginController.updateProfileUserInfo(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Update User Profile Userinfo:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Get Profile User info
users.post('/68ddfd064d1bf11ab6689399a70908c993fd11b9', authenticateJWT, logMiddleware, async (req, res) => {

    loginController.getProfileUserDetails(req.body, res)
         
        .catch(error => {
            console.error('Error requesting get Profile UserDetails:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Reset Mpin
users.post('/73c0a707a700129fd2b4f7cb4b982d3a549904b1', logMiddleware, (req, res) => {

    mpinController.resetMpin(req.body, res) 
        .catch(error => {
            console.error('Error requesting Reset MPIN:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


//Get User Old Income
users.post('/ec6019ea7e315629cee41fc1ec0fa87d90827d35', authenticateJWT, logMiddleware, async (req, res) => {

    oldIncomeController.getIncome(req.body, res)
         
        .catch(error => {
            console.error('Error requesting User Old Income:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Check Old income exist
users.post('/f3fe0b8f30dd498bce7cabe83acc00722db55006', authenticateJWT, logMiddleware, async (req, res) => {

    oldIncomeController.checkIncome(req.body, res)
         
        .catch(error => {
            console.error('Error requesting check Old Income Exists:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Credit debit income to user
users.post('/d7dfaf86f2ab8c7013f268736ab747e07bd8558e', authenticateJWT, logMiddleware, async (req, res) => {

    oldIncomeController.creditDebitIncomeToUser(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Credit Debit Income To User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

//admin reset password
users.post('/1c3bb4525d626c9fabed22789ba34ec12e097222', logMiddleware, (req, res) => {

    resetController.adminResetPassword(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Reset Admin Password:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Update user info admin
users.post('/663afe0b50d03001ceafa9c3634cf0f91235d041', authenticateJWT, logMiddleware, (req, res) => {
    loginController.updateUserDetails(req.body, res)
         
        .catch(error => {
            console.error('Error requesting update User Info Admin:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Check mobile or email admin
users.post('/582c2220d0291f82c235404e6e399821ed67c43f', authenticateJWT, logMiddleware, (req, res) => {
    loginController.checkMobileOrEmail(req.body, res)
         
        .catch(error => {
            console.error('Error requesting check MobileOrEmail:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Update Kyc
users.post('/94ca940072d5ffe21b2b9d922e08617399be3d1f', authenticateJWT, logMiddleware, async (req, res) => {

    kycController.updateKyc(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Update Kyc:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Get qr code
users.post('/e2eea9ffa100bbd9b7e3ef2b0bafb8f59920cea8', authenticateJWT, logMiddleware, (req, res) => {
    QrGenerateController.getQrCode(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Get QrCode:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// unblock user
users.post('/77651f481820ee7a6d33dfde4579d48715f0d1d9', authenticateJWT, logMiddleware, (req, res) => {
    loginController.unblockByUser(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Unblock User:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// go to shop
users.post('/262206799e879277961403f83d477c5e70da8dfc', authenticateJWT, logMiddleware, async (req, res) => {

    registerController.shopingPortalLogin(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Go to Shop:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


// Deactivate user
users.post('/2f1152a7869df19b1a583f4a971291ddcf413ce3', (req, res) => {
    loginController.deactiveUser(req.body, res)
         
        .catch(error => {
            console.error('Error in deactivate user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Get dashboard summary
users.post('/8bf258dbc185162d62688ccca1c730a97097e903', async (req, res) => {

    dashboardController.getDashboard(req.body, res)
         
        .catch(error => {
            console.error('Error in get dashboard summary:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



// Id card purchase
users.post('/14230cdae5a3d15697bc8f40f03d2efb6e52865c', async (req, res) => {

    idCardController.idCard_purchase(req.body, res)
         
        .catch(error => {
            console.error('Error in get dashboard summary:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



users.post('/login', logMiddleware, (req, res) => {

    loginController.login(req.body, res) ;
});

users.post('/admin_login', logMiddleware, (req, res) => {

    loginController.admin_login(req.body, res) ;
});

users.post('/register', (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.register(req.body, res, ipAddress) ;
});

users.post('/register-test', (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.registerTest(req.body, res, ipAddress) ;
});


users.post('/reffer-by', logMiddleware, (req, res) => {
    const ipAddress = req.clientIpAddress;
    registerController.refferedBy(req.body, res, ipAddress) ;
});

users.post('/get-user-details', (req, res) => {
    registerController.getUserDetails(req.body, res) ;
});

users.post('/reset-password', (req, res) => {

    resetController.resetPassword(req.body, res) ;
});

users.post('/get-mpin', (req, res) => {

    mpinController.getMpin(req.body, res) ;
});


// users.post('/upload-kyc', authenticateJWT, fileUpload, async (req, res) => {


//     const userDetails = req.user;
//     const requestData = req.body;
//     const combinedData = {...userDetails,...requestData};

// 	//  upload multiple image
// 	const pan = req.files['panImage'][0];
// 	const aadhar = req.files['aadharImage'][0];
// 	const aadharBack = req.files['aadharBackImage'][0];
// 	const checkbook = req.files['chequeBookImage'][0];

// 	const panImage = pan.filename;
// 	const aadharImage = aadhar.filename;
// 	const aadharBackImage = aadharBack.filename;
// 	const checkbookImage = checkbook.filename;
// 	kycController.uploadKyc(panImage,aadharImage,aadharBackImage,checkbookImage,combinedData,res ) ;

// });





users.post('/get-kyc', async (req, res) => {

    kycController.getKyc(req.body, res) ;
});


users.post('/get-kyc-report', async (req, res) => {

    kycController.getKycReport(req.body, res)
});

// users.post('/get-kyc-report', async (req, res) => {

//     kycController.getKycReport(req.body, res) ;
// });


users.post('/update-kyc-status', async (req, res) => {

    kycController.updateKycStatus(req, res)
});


users.post('/update-user-status', async (req, res) => {

    loginController.updateUserStatus(req.body, res) ;
});


users.post('/get-profile', async (req, res) => {

    loginController.getProfile(req.body, res) ;
});

users.post('/update-user-profile', fileUpload1, async (req, res) => {


    let file;

    if (req.file) {
        file = req.file.filename;
    } else {
        file = null;
    }

    const fileName = file;
    loginController.updateProfile(fileName, req.body, res) ;
});


users.post('/update-profile-userinfo', async (req, res) => {

    loginController.updateProfileUserInfo(req.body, res) ;
});

users.post('/get-profile-userinfo', async (req, res) => {

    loginController.getProfileUserDetails(req.body, res) ;

});



users.post('/reset-mpin', (req, res) => {

    mpinController.resetMpin(req.body, res) ;
});

users.post('/get-user-old-income', async (req, res) => {

    oldIncomeController.getIncome(req.body, res) ;
});


users.post('/check-old-income-exists', async (req, res) => {

    oldIncomeController.checkIncome(req.body, res) ;
});


users.post('/credit-debit-income-to-user', async (req, res) => {

    oldIncomeController.creditDebitIncomeToUser(req.body, res) ;
});


users.post('/admin-reset-password', (req, res) => {

    resetController.adminResetPassword(req.body, res) ;
});



users.post('/update-user-info-admin', (req, res) => {
    loginController.updateUserDetails(req.body, res) ;
});

users.post('/check-mobileOrEmail-admin', (req, res) => {
    loginController.checkMobileOrEmail(req.body, res) ;
});

users.post('/update-kyc', async (req, res) => {

    kycController.updateKyc(req.body, res) ;
});

users.post('/get-qrcode', (req, res) => {
    QrGenerateController.getQrCode(req.body, res) ;
});


users.post('/unblock-user', (req, res) => {
    loginController.unblockByUser(req.body, res) ;
});

users.post('/unblock-user-test', (req, res) => {
    loginController.unblockByUserTest(req.body, res) ;
});
users.post('/go-to-shop', async (req, res) => {

    registerController.shopingPortalLogin(req.body, res) ;
});

users.post('/deactivate-user', (req, res) => {
    loginController.deactiveUser(req.body, res) ;
});

users.post('/get-dashboard-summary', async (req, res) => {

    dashboardController.getDashboard(req.body, res) ;
});

users.post('/my-details', async (req, res) => {

    dashboardController.getMyDashboard(req.body, res) ;
});

users.post('/14230cdae5a3d15697bc8f40f65c', logMiddleware, async (req, res) => {
    loginController.loginTes(req.body, res)
         
        .catch(error => {
            console.error('Error requesting Login:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


users.post('/admin-dashboard', async (req, res) => {

    dashboardController.getDashboardAdmin(req.body, res) ;
});

users.post('/getDashboard_API', async (req, res) => {

    dashboardController.getDashboardAPI(req.body, res) ;
});

module.exports = users;
