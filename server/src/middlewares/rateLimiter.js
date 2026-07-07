const rateLimit = require('express-rate-limit');

const shortenLimit = rateLimit({
    windowMs: 5*60*1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Rate limit exceeded. Try again later in 5 minutes."
        });
    }
});

module.exports = {
    shortenLimit
}