/*
const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

//Cuenta comercio1
CtaComercio1Secr = 'SAZVZEUVSWO2R7EDRKV4C4SCFORQVHDYJ4H4NYBRMYTIQQV6FVYO6QQN';
CtaComercio1Publ = 'GCTK5BZCQPXN6EGXZHJPOVPFGTXLMPGNJW5ZFHUPEHKZ42N5EG4QVPWN';

//Cuenta comercio2
CtaComercio2Secr = 'SD3OKNCFX7IIYJ4INLK4QRVZLRAS7JCEEAHH6O4VKG3XK6LGG4B64HHY';
CtaComercio2Publ = 'GDHHKOAFRBMR7FSMZHUF6UROWJ2HTA42YNLEGHHGI4Z7PCHG7TGGVCKE';

//Cuenta comercio3
CtaComercio3Secr = 'SAMWURQXW24XITBSODGNADDJWL2AGJB5Y6MW23S47HIGOAMG7GY7SCOH';
CtaComercio3Publ = 'GCPDDFLRQEELJOLSNSGABJQ63M7W35O62S7IKDJBGP3X255LO3GMZ3PY';

//Cuenta cliente2
const Clt2Secret = 'SBXP7VMUI6YVU6BENDOPXELS6HOERIHI52EIEMWJOSZINHFKAXTL5S4R';
const Clt2Public = 'GCUZECQIWYSCIH6IMSL6RPJZTUFHXJ2CDKONA4TGQRUZ2EFGEZJF47BK';

//Cuenta FIDEL

FidelSecret = 'SAV6QKDNWUNEERAAB3F46WH2NBZMHIN3DM67ZFI7YPOE45PIK7GI66VW';
FidelPublic = 'GAMVJVI55AZFFTWW2KVFRYL4WOC6CGBMDUWVK624DRCWYAHM6CRP7PKT';
sFidelSecret = 'SDJ2PC6VRCD6EZ2J5WSARGX3YOARPS73P4RJ532BTYQ6OXGQGYZGSRV7';
sFidelPublic = 'GBOIBL7R2QG5I2MWSH4AFBIFRQ5MAXMEZEVIVMT5ZP2HOD4H3CFFRSWE';


// INICIO datos de entrada
// INICIO datos de entrada
// INICIO datos de entrada 
destinationAccountSecretKey = CtaComercio2Secr;
FIDELamount = '250';
// FIN datos de entrada


let sourceAccountSecretKey = FidelSecret;

let source = StellarSdk.Keypair.fromSecret(sourceAccountSecretKey);
let dest = StellarSdk.Keypair.fromSecret(destinationAccountSecretKey);

(async function main() {
  let sourceAccount = await server.loadAccount(source.publicKey())

  let builder = new StellarSdk.TransactionBuilder(sourceAccount, 
    {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET}
  );

  builder.addOperation(StellarSdk.Operation.changeTrust({ 
    asset: new StellarSdk.Asset('FIDEL', FidelPublic),
    source: dest.publicKey()
  }))
  
  builder.addOperation(StellarSdk.Operation.payment({ 
    destination: dest.publicKey(),
    asset: new StellarSdk.Asset('FIDEL', FidelPublic),
    amount: FIDELamount
  }))
  
  builder.setTimeout(180);

  let tx = builder.build()

  tx.sign(source)
  tx.sign(dest)
  
  let txResult = await server.submitTransaction(tx)
  .catch(function(error) {
    console.error('Something went wrong!', error);
  })
  .then(results => {
    console.log('Transaction:', results._links.transaction.href)
  //  console.log('Transaction:', results)
  })
  
})();
*/