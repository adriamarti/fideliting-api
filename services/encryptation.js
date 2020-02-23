const CryptoJS = require("crypto-js");

const encrypt = (string, secret) => {
  return CryptoJS.AES.encrypt(string, secret);
};

const decrypt = (string, secret) => {
  const bytes = CryptoJS.AES.decrypt(string, secret);

  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encrypt,
  decrypt,
}