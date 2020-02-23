const {
  Keypair, // Keypair represents public and secret keys.
  Network, // Network provides helper methods to get the passphrase or id for different stellar networks.
  Operation, // Operation helps you represent/build operations in Stellar network.
  Server, // Server handles the network connections.
  TransactionBuilder // Helps you construct transactions.
} = require('stellar-sdk');

const createAccount = async (secret) => {
  try {
    // Tell the Stellar SDK you are using the testnet
    // Network.useTestNetwork();
    // point to testnet host
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);
  
    // Never put values like the an account seed in code.
    const provisionerKeyPair = Keypair.fromSecret(secret)
  
    // Load account from Stellar
    const provisioner = await stellarServer.loadAccount(provisionerKeyPair.publicKey())
  
    console.log('creating account in ledger', keypair.publicKey())
    const transaction = new StellarSdk.TransactionBuilder(provisioner, {
      networkPassphrase: Networks.TESTNET
      })
      .addOperation(
        // Operation to create new accounts
        Operation.createAccount({
          destination: keypair.publicKey(),
          startingBalance: '2'
        })
      ).build()
    // const transaction = new TransactionBuilder(provisioner)
    //       .addOperation(
    //         // Operation to create new accounts
    //         Operation.createAccount({
    //           destination: keypair.publicKey(),
    //           startingBalance: '2'
    //         })
    //       ).build()
  
    // Sign the transaction above
    transaction.sign(provisionerKeyPair)
  
    // Submit transaction to the server
    const result = await stellarServer.submitTransaction(transaction);
    
    return result
  } catch (err) {
    throw(err);
  }
}

module.exports = {
  createAccount,
}