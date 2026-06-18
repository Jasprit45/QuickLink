const {getClicksByCode , getClicksByCodes} = require('../models/urlModel');

const getClickCounts  = async (req, res) => {
    try {
        const {code} = req.params;
        const data = await getClicksByCode(code);

        if(!data) return res.status(404).json({ success: false, error: 'URL not found' });

        return res.status(200).json({
        success: true,
        data,
        });

    } catch (error) {
        console.error('getClickCounts error:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
}
const getBulkClickCounts  = async (req, res) => {
    try {
        const {codes} = req.body;
         if (!codes || !Array.isArray(codes)) {
        return res.status(400).json({
            success: false,
            message: "codes must be an array",
        });
        }
        const data = await getClicksByCodes(codes);

        if(!data) return res.status(404).json({ success: false, error: 'URL not found' });

        return res.status(200).json({
        success: true,
        data,
        });

    } catch (error) {
        console.error('getBulkClickCounts error:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Server error. Please try again.'
        });
    }
}

module.exports = {
    getClickCounts,
    getBulkClickCounts
}