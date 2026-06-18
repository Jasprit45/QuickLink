const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlController');
const { validateUrl } = require('../middlewares/validateUrl');
const {  getClickCounts, getBulkClickCounts } = require('../controllers/analyticController');

router.post('/shorten',
    validateUrl,
    shortenUrl
);

router.get('/analytics/:code', getClickCounts);

router.post('/analytics', getBulkClickCounts);



module.exports = router;