const {
  Server, // Server handles the network connections.
} = require('stellar-sdk');

const getTransactions = async (companyPublic) => {
  try {
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);

    const companyAccount = await stellarServer.loadAccount(companyPublic);

    return companyAccount.balances;

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  getTransactions,
}