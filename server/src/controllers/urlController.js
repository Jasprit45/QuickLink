const {createUrl , findByCode} = require('../models/urlModel');
const generateCode = require('../utils/generateCode');
require('dotenv').config();

const shortenUrl = async(req,res) => {
   try {
    const  {originalUrl} = req.body;

    console.log("Calling :-", originalUrl);

    const shortCode  = generateCode();

    const newUrl = await createUrl(originalUrl, shortCode);

    console.log(newUrl);

    const short_url = `${process.env.BASE_URL}/${newUrl.short_code}`;

    return res.status(200).json({
        success: true,
        short_url,
        shortCode: newUrl.short_code,
        originalUrl: newUrl.original_url
    });
   } catch (error) {
    console.error('shortenUrl error:', error.message);
    return res.status(500).json({
        success: false,
        error: 'Server error. Please try again.'
    });
   }
}

const redirectUrl = async (req, res) => {
    try {
    const  { code } = req.params;

    const url = await findByCode(code);

    if (!url) return res.status(404).json({ success: false, error: 'Short URL not found' });

    return res.redirect(301, url.original_url);

    } catch (error) {
    console.error('redirectUrl error:', error.message);
    return res.status(500).json({
        success: false,
        error: 'Server error. Please try again.'
    });
   }
}

module.exports = {
    shortenUrl,
    redirectUrl
}