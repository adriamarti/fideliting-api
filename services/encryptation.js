const crypto = require('crypto');

const encrypt = (string) => {
  return crypto
    .createCipher('aes-256-ctr', process.env.STELLAR_ENCRYPT_SECRET)
    .update(string, 'utf-8', 'hex');
};


const decrypt = (string) => {
  return crypto
    .createDecipher('aes-256-ctr', process.env.STELLAR_ENCRYPT_SECRET)
    .update(string, 'hex', 'utf-8');
};

module.exports = {
  encrypt,
  decrypt,
}