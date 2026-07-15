const validateSync = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!process.env.CRON_SECRET) {
        console.error("CRON_SECRET is not configured.");

        return res.status(500).json({
            success: false,
            message: "Server configuration error."
        });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
};

module.exports = {
    validateSync
};