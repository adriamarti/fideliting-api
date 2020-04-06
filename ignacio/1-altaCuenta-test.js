
var StellarSdk = require('stellar-sdk');

//
// datos de entrada
//Cuenta comercio2
CtaComercio2Secr = 'SD3OKNCFX7IIYJ4INLK4QRVZLRAS7JCEEAHH6O4VKG3XK6LGG4B64HHY';
CtaComercio2Publ = 'GDHHKOAFRBMR7FSMZHUF6UROWJ2HTA42YNLEGHHGI4Z7PCHG7TGGVCKE';


const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const source = StellarSdk.Keypair.fromSecret(CtaComercio2Secr);
const destination = StellarSdk.Keypair.random();
console.log("pasa 1");
server.accounts()
  .accountId(source.publicKey())
  .call()
  .then(({ sequence }) => {
    const account = new StellarSdk.Account(source.publicKey(), sequence)
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET
    })
      .addOperation(StellarSdk.Operation.createAccount({
        destination: destination.publicKey(),
        startingBalance: '5.6'
      }))
      .setTimeout(30)
      .build()
    transaction.sign(StellarSdk.Keypair.fromSecret(source.secret()))
    return server.submitTransaction(transaction)
  })
  .then(results => {
    console.log('Transaction:', results._links.transaction.href)
    console.log('Public  key:', destination.publicKey())
    console.log('Private key:', destination.secret())
  }).catch(function(error) {
    console.error('1 Something went wrong!', error.response.data.extras);
  })

