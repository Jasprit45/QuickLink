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

const IncrementClicks = async (shortCode) => {
  const result = await pool.query(
    `UPDATE urls
     SET clicks = clicks + 1
     WHERE short_code = $1
     RETURNING clicks`,
     [shortCode]
  );
  return result.rows[0] || null;
};
const findByCode = async (shortCode) => {
  const result = await pool.query(
    `SELECT * FROM urls
     WHERE short_code = $1`,
     [shortCode]
  );
  return result.rows[0] || null;
};
const getByCode = async (shortCode) => {
  const result = await pool.query(
    `SELECT * FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );
  return result.rows[0] || null;
};

const getClicksByCode = async (shortCode) => {
  const result = await pool.query(
    `SELECT
        clicks
     FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );

  return result.rows[0] || null;
};

const getClicksByCodes = async (codes) => {
  const result = await pool.query(
    `SELECT
        short_code,
        clicks
     FROM urls
     WHERE short_code = ANY($1)`,
    [codes]
  );

  return result.rows;
};

const deleteByCodes = async (codes) => {
  const result = await pool.query(
    `DELETE FROM urls
     WHERE short_code = ANY($1)
     RETURNING short_code`,
    [codes]
  );

  return result.rows;
};

module.exports= {
    createUrl,
    IncrementClicks,
    getClicksByCode,
    getClicksByCodes,
    getByCode,
    findByCode,
    deleteByCodes
}