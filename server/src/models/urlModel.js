const pool  = require('../config/db');

//creating a url 

const createUrl = async (originalUrl, shortCode) => {
    const result = await pool.query(
        `INSERT INTO urls (original_url, short_code)
        VALUES ($1, $2)
        RETURNING *`,
        [originalUrl, shortCode]
    );

     return result.rows[0];
}

const findByCode = async (shortCode) => {
  const result = await pool.query(
    `UPDATE urls
     SET clicks = clicks + 1
     WHERE short_code = $1
     RETURNING *`,
    [shortCode]
  );
  return result.rows[0] || null;
};


module.exports= {
    createUrl,
    findByCode
}