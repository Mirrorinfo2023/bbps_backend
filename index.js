const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const requestIp = require('request-ip');



const port = 3003;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});