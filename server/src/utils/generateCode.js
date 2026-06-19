const {nanoid} = require('nanoid');

const generateCode = () => nanoid(7); //7 character - 3.5 trillion

const generateSuffix = () => nanoid(4);

module.exports = {
    generateCode,
    generateSuffix
}
