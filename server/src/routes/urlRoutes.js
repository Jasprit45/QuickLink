const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlController');
const { validateUrl } = require('../middlewares/validateUrl');
const { shortenLimit } = require('../middlewares/rateLimiter');
const {  getClickCounts, getBulkClickCounts, deleteUrls } = require('../controllers/analyticController');
const {syncClicks} = require('../controllers/syncController');
const {validateSync} = require('../middlewares/validateSync');

router.post('/shorten',
    shortenLimit,
    validateUrl,
    shortenUrl
);

router.get('/analytics/:code', getClickCounts);

router.post('/analytics', getBulkClickCounts);

router.delete('/url', deleteUrls);

router.get('/internal/sync-clicks',
    validateSync,
    syncClicks);

module.exports = router;