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
    // Tell the Stellar SDK you are using the testnet
    // Network.useTestNetwork();
    // point to testnet host
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);
  
    // Never put values like the an account seed in code.
    const provisionerKeyPair = Keypair.fromSecret(process.env.STELLAR_FIDEL_SECRET)

    // Creat New Stellar account
    const newAccount = Keypair.random();

    // Create sequence
    const { sequence } = await stellarServer.accounts().accountId(provisionerKeyPair.publicKey()).call();

    // Fidel Account
    const fidelAccount = new Account(provisionerKeyPair.publicKey(), sequence);

    // Create Transaction
    const transaction = new TransactionBuilder(fidelAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET
      })
      .addOperation(Operation.createAccount({
        destination: newAccount.publicKey(),
        startingBalance: '1.6'
      }))
      .setTimeout(30)
      .build()
    
    // Sign transaction
    transaction.sign(Keypair.fromSecret(provisionerKeyPair.secret()))
    
    // Get Transaction
    const transactionData = await stellarServer.submitTransaction(transaction)

    return {
      transactionData,
      publicKey: newAccount.publicKey(),
      privateKey: newAccount.secret(),
    }

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  createAccount,
}