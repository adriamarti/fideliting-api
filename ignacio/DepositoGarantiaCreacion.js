
var StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var BigNumber = require('bignumber.js');


function prepareEscrowTransactions(garantiaKeypair, garantiaSequence, garantiaExpires, 
              garantiaExpiresMax, remitenteSignKeypair, destinatarioSignKeypair, assetEscrow) {
  var garantiaSequence = new BigNumber(garantiaSequence);

  var completarGarantiaTx = new StellarSdk.TransactionBuilder(
                                  new StellarSdk.Account(garantiaKeypair.publicKey(), 
                                  garantiaSequence.add(1).toString()), {
      fee: StellarSdk.BASE_FEE, 
      networkPassphrase: StellarSdk.Networks.TESTNET,
      timebounds: {
        minTime: garantiaExpires,
        maxTime: garantiaExpiresMax,
      },
    })
    // 
    .addOperation(StellarSdk.Operation.changeTrust({ 
      asset: assetEscrow,
      source: destinatarioSignKeypair.publicKey(),
    }))
    // Remove keys that aren't allowed to perform this transaction
    .addOperation(StellarSdk.Operation.setOptions({
      signer: {
        ed25519PublicKey: destinatarioSignKeypair.publicKey(),
        weight: 1,
      },
    }))
    // Complete escrow payment
    .addOperation(StellarSdk.Operation.payment({
      //destination: recipientKeypair.publicKey(),
      destination: destinatarioSignKeypair.publicKey(),
      asset: assetEscrow,
      amount: Puntos.toString(),
    }))
    // Hand over account access back to the provider
    .addOperation(StellarSdk.Operation.setOptions({
      masterWeight: 0,
      lowThreshold: 2,
      medThreshold: 2,
      highThreshold: 2,
      signer: {
        ed25519PublicKey: remitenteSignKeypair.publicKey(),
        weight: 1,
      },
    }))
    .build();
  
  var reembolsoGarantiaTx = new StellarSdk.TransactionBuilder(
                                        new StellarSdk.Account(garantiaKeypair.publicKey(), 
                                        garantiaSequence.add(1).toString()), {
      fee: StellarSdk.BASE_FEE, 
      networkPassphrase: StellarSdk.Networks.TESTNET,
      timebounds: {
        minTime: 0,
        maxTime: garantiaExpires,
      }
    })
    // 
    .addOperation(StellarSdk.Operation.changeTrust({ 
      asset: assetEscrow,
      source: remitenteSignKeypair.publicKey(),
      //Limit: 0,
    }))
    // Remove keys that aren't allowed to perform this transaction
    .addOperation(StellarSdk.Operation.setOptions({
      signer: {
        ed25519PublicKey: remitenteSignKeypair.publicKey(),
        weight: 0,
      },
    }))
    // Cancel the escrow payment
    .addOperation(StellarSdk.Operation.payment({
      //destination: senderKeypair.publicKey(),
      destination: remitenteSignKeypair.publicKey(),
      asset: assetEscrow,
      amount: Puntos.toString(), 
    }))
    // Hand over account access back to the provider
    .addOperation(StellarSdk.Operation.setOptions({
      masterWeight: 1,
      lowThreshold: 1,
      medThreshold: 1,
      highThreshold: 1,
      signer: {
        ed25519PublicKey: destinatarioSignKeypair.publicKey(),
        weight: 0,
      },
    }))
    .build();
    
  return {
    completarGarantia: completarGarantiaTx,
    reembolsoGarantia: reembolsoGarantiaTx,
  }
}
    

//Cuenta FIDEL
FidelSecret = 'SAV6QKDNWUNEERAAB3F46WH2NBZMHIN3DM67ZFI7YPOE45PIK7GI66VW';
FidelPublic = 'GAMVJVI55AZFFTWW2KVFRYL4WOC6CGBMDUWVK624DRCWYAHM6CRP7PKT';

//Cuenta SFIDEL
const sFidelSecret = 'SDJ2PC6VRCD6EZ2J5WSARGX3YOARPS73P4RJ532BTYQ6OXGQGYZGSRV7';
const sFidelPublic = 'GBOIBL7R2QG5I2MWSH4AFBIFRQ5MAXMEZEVIVMT5ZP2HOD4H3CFFRSWE';

//Cuenta COMPENSATORIA
//const CompensaSecret = 'SDBU5PYDDD6ZUQFW53AOMP2NBP5OOHXPYR6LGB26ALMA4GN6P6RFTBVD';
//const CompensaPublic = 'GC63X7GK7ES5BB6GE3Z3SBZHBFUQEXOTVHMR5JVBB2RTUTT4UTL34OXU';

//Cuenta sociedad fideliting
//CtaCiaFIDELITINGSecr = 'SCUUURKD2UJC2ZSLRQMDGGCQ3ORESTQJ5ZXI7NU7GT65UDLPGMKDIQ36';
//CtaCiaFIDELITINGPubl = 'GDYFWPNPZQI3SEY4NWDHE6TLLC66JETIEI5BKS32NYOT626PFSGPYL4P';

//Cuenta comercio2
CtaComercio2Secr = 'SD3OKNCFX7IIYJ4INLK4QRVZLRAS7JCEEAHH6O4VKG3XK6LGG4B64HHY';
CtaComercio2Publ = 'GDHHKOAFRBMR7FSMZHUF6UROWJ2HTA42YNLEGHHGI4Z7PCHG7TGGVCKE';

//Cuenta cliente2
Clt2Secret = 'SCUTOR4RL2H6DHDRCDAZANSDOO2BF7VSV4J75K3SAVPOAM56UKRJC5T6';
Clt2Public = 'GBYWWVDODJRKGONGXJWAKKOTEKU3Z3SH2QH4KJOIJKCHXONTGF2WDXQH';

var CtaGarantiaSecret;
var CtaGarantiaPublic;
var sourceAccount;


//*****************************************************************************************
CtaGarantiaSecret = 'SAJ76RCTKGWMPKFLKXN56NRTCSYBRKYP7AOAJDTEJ42OGVP45DRKCETG';
CtaGarantiaPublic = 'GCTBIL7QHDAOISAVLSPAVDPBMNQL7M2ATF7QM3J2V6N4LI5AFJCLUCLP';
//*****************************************************************************************

let garantiaKeypair = StellarSdk.Keypair.fromSecret(CtaGarantiaSecret);
let remitenteSignKeypair = StellarSdk.Keypair.fromSecret(CtaComercio2Secr);
let destinatarioSignKeypair = StellarSdk.Keypair.fromSecret(Clt2Secret);
let Puntos = 2.3456;
let idCompra = 'A123456';


///////////////////////////////////////////////////////////////////////
// transferimos FIDELES de la compañia a la cuenta de garantia
(async function TransfiereFidelDeComercioToCuentaGarantia() {
    
  sourceAccount = await server.loadAccount(remitenteSignKeypair.publicKey())
  
  let builder = new StellarSdk.TransactionBuilder(sourceAccount, 
      {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET}
  )
  .addOperation(StellarSdk.Operation.changeTrust({ 
      asset: new StellarSdk.Asset('FIDEL', FidelPublic),
      source: garantiaKeypair.publicKey()
  }))
  .addOperation(StellarSdk.Operation.payment({ 
      destination: garantiaKeypair.publicKey(),
      asset: new StellarSdk.Asset('FIDEL', FidelPublic),
      amount: Puntos.toString()
  }))
  //.addOperation(StellarSdk.Operation.manageData({ 
  //  name: idCompra,
  //  value: CtaGarantiaSecret,
  //}))    
  .setTimeout(180);                      

  console.log("CtaGarantiaSecret ", CtaGarantiaSecret);

  let tx1 = builder.build()
  tx1.sign(remitenteSignKeypair)
  tx1.sign(garantiaKeypair)
  
  let txResult = await server.submitTransaction(tx1)
  .catch(function(error) {
      console.log('-------------------------------------------------------');
      console.error('1 Something went wrong!', error.response.data.extras);
      console.log('-------------------------------------------------------');
  })
  .then(results => {
      console.log('-------------------------------------------------------');
      console.log("Transferencia de comercio a cuenta de garantia realizada");  
      console.log('Transaction1:')//, results._links.transaction.href)
      console.log('-------------------------------------------------------');
      
  }) 
//})();


//  server.accounts()
//  .accountId(remitenteSignKeypair.publicKey())
//  .call()
//  .then(function (account) {
//    return account.data({key: idCompra})
//  })
//  .then(function(dataValue) {
//    console.log(dataValue.value)
//  })
//  .catch(function (err) {
//    console.log("Error 1", err)
//  })


  var account;
  var garantiaSequence; 
  //(async function main() {
  account = await server.loadAccount(garantiaKeypair.publicKey())
  
  garantiaSequence = account.sequence;

  let garantiaExpires = Math.floor(new Date().getTime()/1000.0) + 3600; // 1 hora
  let garantiaExpiresMax = Math.floor(new Date().getTime()/1000.0) + 3600*2; // 2 hora
  
  var txs = prepareEscrowTransactions(garantiaKeypair, garantiaSequence, garantiaExpires,
                  garantiaExpiresMax, remitenteSignKeypair, destinatarioSignKeypair,
                  new StellarSdk.Asset('FIDEL', FidelPublic));

  ///////////////////////////////////////////////////////////////////////
  // Lanzamiento de la TX que gestiona la cuenta de garantia
  var tx = new StellarSdk.TransactionBuilder(account,
                            {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET})
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: remitenteSignKeypair.publicKey(),
      weight: 1,
    },
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: destinatarioSignKeypair.publicKey(),
      weight: 1,
    },
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      preAuthTx: txs.completarGarantia.hash(),
      weight: 2,
    },
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      preAuthTx: txs.reembolsoGarantia.hash(),
      weight: 2,
    },
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    masterWeight: 0,
    lowThreshold: 3,
    medThreshold: 3,
    highThreshold: 3,
  }))
  //.addOperation(StellarSdk.Operation.manageData({ 
  //    name: 'completarGarantiaHash',
  //    value: txs.completarGarantia.hash(),  
  //}))
  //.addOperation(StellarSdk.Operation.manageData({ 
  //  name: 'reembolsoGarantiaHash',
  //  value: txs.reembolsoGarantia.hash(),
  //}))
  .setTimeout(130)
  .build();
  
  tx.sign(garantiaKeypair);

  server.submitTransaction(tx)
  .catch(function(error) {
    console.log('-------------------------------------------------------');
    console.error('Something went wrong!', error.response.data.extras);
    console.log('-------------------------------------------------------');
  })
  .then(results => {
    console.log('-------------------------------------------------------');
    console.log("Smart Contract lanzado");  
    console.log('Transaction           :', results._links.transaction.href)
    console.log('completarGarantia     :', txs.completarGarantia.toXDR() );
    //console.log('completarGarantiaHash :', StellarSdk.StrKey.encodeEd25519PublicKey(txs.completarGarantia.hash()));
    console.log('reembolsoGarantiaHash :', txs.reembolsoGarantia.hash())
    //console.log('reembolsoGarantiaHash :', StellarSdk.StrKey.encodeEd25519PublicKey(txs.reembolsoGarantia.hash()));
    console.log('reembolsoGarantia     :', txs.reembolsoGarantia.toXDR());
    console.log('-------------------------------------------------------');
    //console.log('Transaction:', results.envelope_xdr )
    //console.log('-------------------------------------------------------');
    //console.log('Transaction:', results.hash )
    //console.log('-------------------------------------------------------');
    
  })
    
    ///////////////////////////////////////////////////////////////////////
    // ejecución de la consolidación de los puntos en la cuenta del cliente
    //let tx2 = txs.completarGarantia;
    //tx2.sign(destinatarioSignKeypair);
    

    ///////////////////////////////////////////////////////////////////////
    // ejecución del reembolso por devolución por parte del cliente del articulo
    //let tx2 = txs.reembolsoGarantia;
    //tx2.sign(remitenteSignKeypair);
    console.log('fin');
})();
