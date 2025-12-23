const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const requestIp = require('request-ip');
const expressSharp = require('express-sharp');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
const allowedOrigins = ['http://localhost:3000', 'https://secure.snape.org.in', 'https://control.mirrorinfo.in','https://app.mirrorinfo.in', 'https://secure.mirrorinfo.in', 'https://admin.boltpe.money', 'https://secure.boltpe.money'];

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // Check if the origin is in the allowedOrigins array or if it's a null (meaning same-origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
    //callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // For preflight requests
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Custom middleware to check the Origin header
const checkOrigin = (req, res, next) => {
  const origins = req.get('Origin');

  if (!origins || allowedOrigins.includes(origins)) {
    next();
  } else {
    res.status(403).send('Forbidden: Not allowed by CORS');
  }
};
app.use(checkOrigin);

app.use(
  helmet({
    // Enable contentSecurityPolicy with default settings
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'"],
      },
    },
    frameguard: {
      action: 'deny',
    },
    hsts: {
      maxAge: 31536000,  // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    nosniff: true,
    ieNoOpen: true,
    dnsPrefetchControl: {
      allow: false,
    },
    // Enable XSS filter (setOnOldIE is false by default)
    xssFilter: true,
  })
);
app.use(express.json());
app.use(requestIp.mw());

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  const ipAddress = req.clientIp || 'unknown';
  req.clientIpAddress = ipAddress;
  next();
});
//image optimisation



const cacheMiddleware = require('./mirrorapi/middleware/cacheMiddleware');
const initializeRedis = require('./redis');
const redisClient = initializeRedis();
app.get('/redis-cache-flushall', async (req, res) => {

  redisClient.flushall((err, reply) => {
    if (err) {
      console.error('Error flushing Redis:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Redis flushed successfully:', reply);
    res.send('Redis flushed successfully!');
  });

});


const port = 4880;

const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app.use('/api-referral-docs', swaggerUi.serve, swaggerUi.setup(swaggerReferralDocument));

const users = require('./mirrorapi/router/users/users');
app.use('/api/users', users);

const pincode = require('./mirrorapi/router/pincode/pincode');
app.use('/api/pincode', pincode);

const countries = require('./mirrorapi/router/countries/countries');
app.use('/api/countries', countries);

const state = require('./mirrorapi/router/state/state');
app.use('/api/state', state);

const city = require('./mirrorapi/router/city/city');
app.use('/api/city', city);


const otp = require('./mirrorapi/router/otp/otp');
app.use('/api/otp', otp);


/**********************STARTWALLET ******************************/
const wallet = require('./mirrorapi/router/wallet/wallet');
app.use('/api/wallet', wallet);

/**********************START ADD MONEY ******************************/
const add_money = require('./mirrorapi/router/add_money/add_money');
app.use('/api/add_money', add_money);

/**********************START RECHARGE*************************************/
const recharge = require('./mirrorapi/router/recharge/recharge');
app.use('/api/recharge', recharge);

const rechargeServiceDiscount = require('./mirrorapi/router/recharge/rechargeServiceDiscount');
app.use('/api/recharge/discount', rechargeServiceDiscount);

const serviceOperator = require('./mirrorapi/router/operator/operator');
app.use('/api/operator', serviceOperator);

const Rechargeservices = require('./mirrorapi/router/recharge/services');
app.use('/api/recharge/service', Rechargeservices);
/***********************END RECHARGE**************************************/

/**********************START BROWSE PLAN*************************************/
const mplan = require('./mirrorapi/router/plan/plan');
app.use('/api/browsePlan', mplan);


/*********************************START REFERRAL************************************/


const referralPlan = require('./mirrorapi/router/referral/referralPlan');
app.use('/api/referral/plan', referralPlan);



/*********************************END REFERRAL************************************/

/*********************************START SEND MONEY(Wallet to wallet transfer)************************************/
const send_money = require('./mirrorapi/router/send_money/send_money');
app.use('/api/send_money', send_money);
/*********************************END SEND MONEY************************************/

/**********************START CRON JOB*************************************/
const cronJobHandler = require('./mirrorapi/cron/CronJobHandler');
/**********************START CRON SETUP*************************************/

/************* Report ************/
const report = require('./mirrorapi/router/reports/report');
app.use('/api/report', report);

// const user_summary = require('./api/router/reports/user_summary');
// app.use('/api/report', user_summary);

const passbook = require('./mirrorapi/router/reports/passbook');
app.use('/api/report', passbook);


const billPay = require('./mirrorapi/router/bill_pay/bill_pay');
app.use('/api/bill_payment', billPay);



const page = require('./mirrorapi/router/page/page');
app.use('/api/page', page);

const banner = require('./mirrorapi/router/banner/banner');
app.use('/api/banner', banner);

const problem_feedback = require('./mirrorapi/router/feedback/feedback');
app.use('/api/feedback', problem_feedback);


const otp_report = require('./mirrorapi/router/reports/otp');
app.use('/api/report', otp_report);

const refferal = require('./mirrorapi/router/reports/refferal');
app.use('/api/refferal-report', refferal);

const recentUse = require('./mirrorapi/router/log/logs');
app.use('/api/log', recentUse);

const user_intrest = require('./mirrorapi/router/users/user_intrest');
app.use('/api/user_intrest', user_intrest);


const fcm_notification = require('./mirrorapi/router/notification/notification');
app.use('/api/notification', fcm_notification);


const callBack = require('./mirrorapi/router/callback/callback');
app.use('/api/callback', callBack);

const whatsapp = require('./mirrorapi/router/whatsapp/whatsapp');
app.use('/api/whatsapp', whatsapp);

const insurance = require('./mirrorapi/router/insurance/insurance');
app.use('/api/insurance', insurance);

const leads_category = require('./mirrorapi/router/leads/categories');
app.use('/api/leads', leads_category);


const leads = require('./mirrorapi/router/leads/leads');
app.use('/api/leads', leads);


const graphics = require('./mirrorapi/router/graphics/graphics');
app.use('/api/graphics', graphics);

const meeting = require('./mirrorapi/router/meeting/meeting');
app.use('/api/meeting', meeting);

const setting = require('./mirrorapi/router/setting/setting');
app.use('/api/setting', setting);

const ebook = require('./mirrorapi/router/ebook/ebook');
app.use('/api/ebook', ebook);

const ebookCategories = require('./mirrorapi/router/ebook/ebookCategories');
app.use('/api/ebookCategories', ebookCategories);

const spinner = require('./mirrorapi/router/spinner/spinner');
app.use('/api/spinner', spinner);


const ccavenue = require('./mirrorapi/router/ccavenue/ccavenue');
app.use('/api/ccavenue', ccavenue);

const rating = require('./mirrorapi/router/rating/rating');
app.use('/api/rating', rating);

const affiliate_link = require('./mirrorapi/router/affiliate_link/affiliate_link');
app.use('/api/affiliate_link', affiliate_link);

const user_activity_track = require('./mirrorapi/router/user_activity_track/user_activity_track');
app.use('/api/user_activity_track', user_activity_track);

const phonepe = require('./mirrorapi/router/phonepe/phonepe');
app.use('/api/phonepe', phonepe);

const ship_rocket = require('./mirrorapi/router/shopping/ship_rocket');
app.use('/api/shopping/ship_rocket', ship_rocket);

const ccavenuePay = require('./mirrorapi/router/bill_pay/ccavenue_payment');
app.use('/api/payment', ccavenuePay);

const affiliate_category = require('./mirrorapi/router/affiliate_link/categories');
app.use('/api/affiliate_link', affiliate_category);


const course_video = require('./mirrorapi/router/course_video/course_video');
app.use('/api/course_video', course_video);

const course_videocategories = require('./mirrorapi/router/course_video/categories');
app.use('/api/course_video', course_videocategories);


// courses videos and course categories made by aniket
const courses_video = require('./mirrorapi/router/courses/course_video');
app.use('/api/courses_video', courses_video);

const courses_videocategories = require('./mirrorapi/router/courses/course_category');
app.use('/api/courses_video', courses_videocategories);



// our payment gateway
const gateway = require('./mirrorapi/router/payment_gateway/gateway');
app.use('/api/gateway', gateway);


const employee = require('./mirrorapi/router/employee/employee');
app.use('/api/employee', employee);

const menu = require('./mirrorapi/router/setting/menu');
app.use('/api/menu', menu);


const royality = require('./mirrorapi/router/royality/royality');
app.use('/api/royality', royality);



const product = require('./mirrorapi/router/products/products');
app.use('/api/product', product);

const packages = require('./mirrorapi/router/package/package');
app.use('/api/package', packages);

const order_history = require('./mirrorapi/router/orderhistory/orderhistory');
app.use('/api/orderhistory', order_history);

const customer_address = require('./mirrorapi/router/customer_address/customer_address');
app.use('/api/customer_address', customer_address);

const customer_cart = require('./mirrorapi/router/customer_cart/customer_cart');
app.use('/api/customer_cart', customer_cart);

const loanRequest = require('./mirrorapi/router/loan/loan');
app.use('/api/loan', loanRequest);

const partner = require('./mirrorapi/router/partners/partner');
app.use('/api/partner', partner);


const cart = require('./mirrorapi/router/cart/cart');
app.use('/api/cart', cart);

const slab = require('./mirrorapi/router/slab/slab');
app.use('/api/slab', slab);

const marketing = require('./mirrorapi/router/marketing/marketing_routes');
app.use('/api/marketing', marketing);

const admin = require('./mirrorapi/router/admin/admin_routes');
app.use('/api/admin', admin);

const testing = require('./mirrorapi/router/testing/test_routes');
app.use('/api/testing', testing);

const primeUserRoutes = require('./mirrorapi/router/prime_request/primeUserRoutes');
app.use('/api', primeUserRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
