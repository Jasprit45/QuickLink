const {nanoid} = require('nanoid');

const generateCode = () => nanoid(7); //7 character - 3.5 trillion

module.exports = generateCode;