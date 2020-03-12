const {
  Asset,
  Keypair, // Keypair represents public and secret keys.
  Networks, // Network provides helper methods to get the passphrase or id for different stellar networks.
  Operation, // Operation helps you represent/build operations in Stellar network.
  Server, // Server handles the network connections.
  TransactionBuilder, // Helps you construct transactions.
  BASE_FEE // Stellar default Fee Base
} = require('stellar-sdk');
const {
  S_FIDEL_RATIO_EXCHANGE,
  S_FIDEL_FIDELITING_RATIO_EXCHANGE,
} = require('../constants/economy')

const transferFidels = async (companySecret, clientSecret, amount) => {
  try {
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);

    const companyKeyPair = Keypair.fromSecret(companySecret);
    const clientKeyPair = Keypair.fromSecret(clientSecret);
    const provisionerAccount = await stellarServer.loadAccount(companyKeyPair.publicKey())

    const transactionBuilder = new TransactionBuilder(provisionerAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    });

    transactionBuilder.addOperation(Operation.changeTrust({ 
      asset: new Asset('FIDEL', process.env.STELLAR_FIDEL_PUBLIC),
      source: clientKeyPair.publicKey(),
    }));
    
    transactionBuilder.addOperation(Operation.payment({
      asset: new Asset('FIDEL', process.env.STELLAR_FIDEL_PUBLIC), 
      destination: clientKeyPair.publicKey(),
      amount,
    }));

    transactionBuilder.setTimeout(180);

    const transaction = transactionBuilder.build();
    transaction.sign(companyKeyPair);
    transaction.sign(clientKeyPair);

    const submittedTransaction = await stellarServer.submitTransaction(transaction);

    return submittedTransaction;

  } catch (err) {
    console.log(err);
    throw(err);
  }
}

const transferSFidels = async (companySecret, amount) => {
  console.log('companySecret', companySecret)
  try {
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);

    const sFidelKeyPair = Keypair.fromSecret(process.env.STELLAR_S_FIDEL_SECRET);
    const fidelitingKeyPair = Keypair.fromSecret(process.env.FIDELITING_ACCOUNT_SECRET);
    const companyKeyPair = Keypair.fromSecret(companySecret);
    
    const provisionerAccount = await stellarServer.loadAccount(sFidelKeyPair.publicKey());

    const sFidelAmountToCompany = +amount * S_FIDEL_RATIO_EXCHANGE;
    const sFidelAmountToFideliting = +amount * S_FIDEL_FIDELITING_RATIO_EXCHANGE;

    const transactionBuilder = new TransactionBuilder(provisionerAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    });

    console.log('process.env.STELLAR_S_FIDEL_PUBLIC', process.env.STELLAR_S_FIDEL_PUBLIC)

    transactionBuilder.addOperation(Operation.changeTrust({ 
      asset: new Asset('SFIDEL', process.env.STELLAR_S_FIDEL_PUBLIC),
      source: companyKeyPair.publicKey(),
    }));

    transactionBuilder.addOperation(Operation.changeTrust({ 
      asset: new Asset('SFIDEL', process.env.STELLAR_S_FIDEL_PUBLIC),
      source: fidelitingKeyPair.publicKey(),
    }));

    transactionBuilder.addOperation(Operation.payment({
      asset: new Asset('SFIDEL', process.env.STELLAR_S_FIDEL_PUBLIC), 
      destination: companyKeyPair.publicKey(),
      amount: '1',
    }));

    transactionBuilder.addOperation(Operation.payment({
      asset: new Asset('SFIDEL', process.env.STELLAR_S_FIDEL_PUBLIC), 
      destination: fidelitingKeyPair.publicKey(),
      amount: sFidelAmountToFideliting.toString(),
    }));

    transactionBuilder.setTimeout(180);

    const transaction = transactionBuilder.build();
    transaction.sign(sFidelKeyPair);
    transaction.sign(companyKeyPair);
    transaction.sign(fidelitingKeyPair);

    const submittedTransaction = await stellarServer.submitTransaction(transaction);

    return submittedTransaction;

  } catch (err) {
    console.log('error------------------')
    console.log(err.response.data.extras.result_codes);
    console.log('error------------------')
    // console.log(err.response.data.extras)
    throw(err);
  }
}

module.exports = {
  transferFidels,
  transferSFidels,
}