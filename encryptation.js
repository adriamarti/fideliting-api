const Cryptr = require('cryptr');
const cryptr = new Cryptr('i/DAc)SW3Pvf%p)P1D5f8fhwaV7P?$SA');

const encrypt = (string) => {
  return cryptr.encrypt(string);
};

const decrypt = (string) => {
  return cryptr.decrypt(string);
};

module.exports = {
  encrypt,
  decrypt,
}