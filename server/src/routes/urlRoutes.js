const express = require('express');
const router = express.Router();
const { shortenUrl } = require('../controllers/urlController');
const { validateUrl } = require('../middlewares/validateUrl');

router.post('/shorten',
    validateUrl,
    shortenUrl
);



module.exports = router;