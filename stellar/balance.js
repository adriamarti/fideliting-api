const {
  Server, // Server handles the network connections.
} = require('stellar-sdk');

const getBalance = async (publicKey) => {
  try {
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);
    const assetCodes = ['FIDEL', 'SFIDEL'];

    const { balances } = await stellarServer.loadAccount(publicKey);

    const fidelitingBalances = balances
      .filter(({ asset_code }) => assetCodes.includes(asset_code))
      .reduce((acc, { asset_code, balance }) => {
        return acc = {
          ...acc,
          [asset_code]: balance,
        }
      }, {})

    return fidelitingBalances;

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  getBalance,
}