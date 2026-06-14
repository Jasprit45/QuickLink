const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
require('dotenv').config();
const urlRouter =  require('./src/routes/urlRoutes');
const { redirectUrl } = require('./src/controllers/urlController');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.use('/api', urlRouter);

app.get('/:code', redirectUrl);

app.listen(PORT , ()=> {
    console.log(`server is running on ${PORT}`);
});