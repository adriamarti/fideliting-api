
var StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


//Cuenta FIDEL
FidelSecret = 'SAV6QKDNWUNEERAAB3F46WH2NBZMHIN3DM67ZFI7YPOE45PIK7GI66VW';
FidelPublic = 'GAMVJVI55AZFFTWW2KVFRYL4WOC6CGBMDUWVK624DRCWYAHM6CRP7PKT';

//Cuenta comercio2
CtaComercio2Secr = 'SD3OKNCFX7IIYJ4INLK4QRVZLRAS7JCEEAHH6O4VKG3XK6LGG4B64HHY';
CtaComercio2Publ = 'GDHHKOAFRBMR7FSMZHUF6UROWJ2HTA42YNLEGHHGI4Z7PCHG7TGGVCKE';

//Cuenta cliente2
Clt2Secret = 'SCUTOR4RL2H6DHDRCDAZANSDOO2BF7VSV4J75K3SAVPOAM56UKRJC5T6';
Clt2Public = 'GBYWWVDODJRKGONGXJWAKKOTEKU3Z3SH2QH4KJOIJKCHXONTGF2WDXQH';

var CtaGarantiaSecret;
var CtaGarantiaPublic;

//*****************************************************************************************
CtaGarantiaSecret = 'SAJ76RCTKGWMPKFLKXN56NRTCSYBRKYP7AOAJDTEJ42OGVP45DRKCETG';
CtaGarantiaPublic = 'GCTBIL7QHDAOISAVLSPAVDPBMNQL7M2ATF7QM3J2V6N4LI5AFJCLUCLP';
//*****************************************************************************************

let garantiaKeypair = StellarSdk.Keypair.fromSecret(CtaGarantiaSecret);
let remitenteSignKeypair = StellarSdk.Keypair.fromSecret(CtaComercio2Secr);
let destinatarioSignKeypair = StellarSdk.Keypair.fromSecret(Clt2Secret);

///////////////////////////////////////////////////////////////////////
// Merge de la cuenta de garantia a la compañia recuperando los XLM.
(async function mergeAccount() {
    //
    // env de reembolsa garantia
    xdr1 = 'AAAAALsKmXgrhxHNgjNNaEHgpZ2tuv9dnt1SfdMgOrvzGjmgAAABkAAOFCoAAAACAAAAAQAAAAAAAAAAAAAAAF5+eAEAAAAAAAAABAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAAGAAAAAkZJREVMAAAAAAAAAAAAAAAZVNUd6DJSztbSqljhfLOF4RgsHS1Ve1wcRWwA7PCi/3//////////AAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAAAAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAACRklERUwAAAAAAAAAAAAAABlU1R3oMlLO1tKqWOF8s4XhGCwdLVV7XBxFbADs8KL/AAAAAAFl6QAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAAAAAAAAAAAAAA='
    tx = new StellarSdk.Transaction(xdr1, StellarSdk.Networks.TESTNET)
    reembolsoGarantiaHash = tx.hash();

    //
    // env de completa garantia
    xdr1 = 'AAAAALsKmXgrhxHNgjNNaEHgpZ2tuv9dnt1SfdMgOrvzGjmgAAABkAAOFCoAAAACAAAAAQAAAABefngBAAAAAF5+hhEAAAAAAAAABAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAAGAAAAAkZJREVMAAAAAAAAAAAAAAAZVNUd6DJSztbSqljhfLOF4RgsHS1Ve1wcRWwA7PCi/3//////////AAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAABAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAACRklERUwAAAAAAAAAAAAAABlU1R3oMlLO1tKqWOF8s4XhGCwdLVV7XBxFbADs8KL/AAAAAAFl6QAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAABAAAAAAAAAAA='
    tx = new StellarSdk.Transaction(xdr1, StellarSdk.Networks.TESTNET)
    completarGarantiaHash = tx.hash();


    account = await server.loadAccount(garantiaKeypair.publicKey())
    var tx3 = new StellarSdk.TransactionBuilder(account,
        {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET})      
    .addOperation(StellarSdk.Operation.setOptions({
        signer: {
        ed25519PublicKey: remitenteSignKeypair.publicKey(),
        weight: 0,
        },
    }))
    .addOperation(StellarSdk.Operation.setOptions({
        signer: {
        ed25519PublicKey: destinatarioSignKeypair.publicKey(),
        weight: 0,
        },
    }))
    .addOperation(StellarSdk.Operation.setOptions({
        signer: {
        preAuthTx: completarGarantiaHash,
        weight: 0,
        },
    }))
    .addOperation(StellarSdk.Operation.setOptions({
        signer: {
        preAuthTx: reembolsoGarantiaHash,
        weight: 0,
        },
    }))
    .addOperation(StellarSdk.Operation.changeTrust({ 
        asset: new StellarSdk.Asset('FIDEL', FidelPublic),
        limit: '0',
    }))
    // Merge de la cuenta de garantia a la cuenta del comercio
    .addOperation(StellarSdk.Operation.accountMerge({
        destination: remitenteSignKeypair.publicKey(),
    }))

    .setTimeout(130)
    .build();

    tx3.sign(garantiaKeypair);

    server.submitTransaction(tx3)
    .catch(function(error) {
        console.log('-------------------------------------------------------');
        console.error('Something went wrong 3!', error.response.data.extras);
        console.log('-------------------------------------------------------');
    })
    .then(results => {
        console.log('-------------------------------------------------------');
        console.log('Transaction3:', results._links.transaction.href)
        console.log('-------------------------------------------------------');

    })
})();
