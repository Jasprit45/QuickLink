const {IncrementClicks ,findByCode} = require('../models/urlModel');
const redis  = require('../config/redis')

const findUrlByCode = async (code) => {
    try {
        const cachedUrl = await redis.get(`url:${code}`);
        if(cachedUrl){
            console.log("REDIS hitt --");
            await IncrementClicks(code);
            return cachedUrl;
        }
        console.log("Redis MISS");

        const url = await findByCode(code);
        if(!url) return null;

        await redis.set(
            `url:${code}`,
            url.original_url,
            {
                ex:3600
            }
        );

        await redis.incr(`click:${code}`);

        await IncrementClicks(code);
        return url.original_url;

    } catch (error) {
        
    }
}

module.exports = {
    findUrlByCode
}