const {
  Asset,
  Keypair, // Keypair represents public and secret keys.
  Networks, // Network provides helper methods to get the passphrase or id for different stellar networks.
  Operation, // Operation helps you represent/build operations in Stellar network.
  Server, // Server handles the network connections.
  TransactionBuilder, // Helps you construct transactions.
  BASE_FEE // Stellar default Fee Base
} = require('stellar-sdk');

const buyFidels = async (companySecret, amount) => {
  try {
    const provisionerKeyPair = Keypair.fromSecret(process.env.STELLAR_FIDEL_SECRET);
    const companyKeyPair = Keypair.fromSecret(companySecret);

    const stellarServer = new Server(process.env.STELLAR_TEST_NET);

    const provisionerAccount = await stellarServer.loadAccount(provisionerKeyPair.publicKey());

    const transactionBuilder = new TransactionBuilder(provisionerAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    });

    transactionBuilder.addOperation(Operation.changeTrust({ 
      asset: new Asset('FIDEL', process.env.STELLAR_FIDEL_PUBLIC),
      source: companyKeyPair.publicKey(),
    }));
    
    transactionBuilder.addOperation(Operation.payment({
      asset: new Asset('FIDEL', process.env.STELLAR_FIDEL_PUBLIC), 
      destination: companyKeyPair.publicKey(),
      amount,
    }));

    transactionBuilder.setTimeout(180);

    const transaction = transactionBuilder.build();
    transaction.sign(provisionerKeyPair);
    transaction.sign(companyKeyPair);

    const submittedTransaction = await stellarServer.submitTransaction(transaction);

    return submittedTransaction;

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  buyFidels,
}