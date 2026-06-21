const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlController');
const { validateUrl } = require('../middlewares/validateUrl');
const {  getClickCounts, getBulkClickCounts, deleteUrls } = require('../controllers/analyticController');

router.post('/shorten',
    validateUrl,
    shortenUrl
);

router.get('/analytics/:code', getClickCounts);

router.post('/analytics', getBulkClickCounts);

router.delete('/url', deleteUrls);



module.exports = router;