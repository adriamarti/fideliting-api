const fetch = require('node-fetch');
const { apiBaseEndpoint } = require('./config');

const createAccount = async (password = {}) => {
  try {
    const response = await fetch(`${apiBaseEndpoint}eth/accounts`, {
      method: "post",
      headers: {
        "Authorization": `Bearer ${process.env.KALEIDO_API_TOKEN}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
  
    const accountAddressData = await response.json();

    return accountAddressData;
  } catch (err) {
    throw(err);
  }
}

module.exports = {
  createAccount,
}