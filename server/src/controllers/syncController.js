const redis = require('../config/redis');
const {addClicks} = require('../models/urlModel');

 const syncClicks = async (req, res) => {
    try {
        const codes = await redis.smembers('active_clicks');
        
        console.log("Syncking----");
        
        for(const code of codes){
            const clicks = Number(await redis.get(`click:${code}`));
            if(clicks > 0) {
                await addClicks(code, clicks);
                await redis.getdel(`click:${code}`);
            }
        }
        
        await redis.del("active_clicks");
        
        res.json({
            success:true
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Failed to sync clicks."
        });
    }

};

// Compose 
// gradebim 

module.exports = {
    syncClicks
}
