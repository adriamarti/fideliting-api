const {
  Account,
  Keypair, // Keypair represents public and secret keys.
  Networks, // Network provides helper methods to get the passphrase or id for different stellar networks.
  Operation, // Operation helps you represent/build operations in Stellar network.
  Server, // Server handles the network connections.
  TransactionBuilder, // Helps you construct transactions.
  BASE_FEE // Stellar default Fee Base
} = require('stellar-sdk');

const createAccount = async () => {
  try {
    // Set Stellar Server
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);
    
    // Get keyPair of provider fidel account (accoun responsable of sending FIDEL)
    const providerFidel = Keypair.fromSecret(process.env.STELLAR_FIDEL_SECRET)

    // Creat New Stellar account
    const newAccount = Keypair.random();

    // Create sequence
    const { sequence } = await stellarServer.accounts().accountId(providerFidel.publicKey()).call();

    // Provider Fidel Account
    const providerFidelAccount = new Account(providerFidel.publicKey(), sequence);

    // Create Transaction
    const transactionBuilder = new TransactionBuilder(providerFidelAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
      })

    transactionBuilder.addOperation(Operation.createAccount({
      destination: newAccount.publicKey(),
      startingBalance: '10'
    }))

    transactionBuilder.setTimeout(30);

    const transaction = transactionBuilder.build();
    
    // Sign transaction
    transaction.sign(Keypair.fromSecret(providerFidel.secret()));
    
    // Get Transaction
    const transactionData = await stellarServer.submitTransaction(transaction);

    return {
      transactionData,
      publicKey: newAccount.publicKey(),
      secret: newAccount.secret(),
    }

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  createAccount,
}