
var StellarSdk = require('stellar-sdk');

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

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

//CtaComercio1Secr = 'SAZVZEUVSWO2R7EDRKV4C4SCFORQVHDYJ4H4NYBRMYTIQQV6FVYO6QQN';
//CtaComercio1Publ = 'GCTK5BZCQPXN6EGXZHJPOVPFGTXLMPGNJW5ZFHUPEHKZ42N5EG4QVPWN';


//Cuenta comercio3
//CtaComercio3Secr = 'SAMWURQXW24XITBSODGNADDJWL2AGJB5Y6MW23S47HIGOAMG7GY7SCOH';
//CtaComercio3Publ = 'GCPDDFLRQEELJOLSNSGABJQ63M7W35O62S7IKDJBGP3X255LO3GMZ3PY';

//Cuenta cliente1
//Clt1Secret = 'SDEG5XH5DZKZ3KUU5VGTTMJ375HEXN3KSBSU664SVDCLXRXLYTKIBCK2';
//Clt1Public = 'GADTUAMIK6IFZEL6H24LHLXXCN7GO7A4PQNKVRPBXOL444TXISFWB6E6';

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
let PuntosFIDEL = 2.3456;
let idCompra = 'A123456';

(async function consulta() {
  //
  // env de reembolsa garantia
  xdr1 = 'AAAAAKYUL/A4wORIFVyeCo3hY2C/s0CZfwZtOq+bxaOgKkS6AAABkAAOFC0AAAACAAAAAQAAAAAAAAAAAAAAAF5+oJ0AAAAAAAAABAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAAGAAAAAkZJREVMAAAAAAAAAAAAAAAZVNUd6DJSztbSqljhfLOF4RgsHS1Ve1wcRWwA7PCi/3//////////AAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAAAAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAACRklERUwAAAAAAAAAAAAAABlU1R3oMlLO1tKqWOF8s4XhGCwdLVV7XBxFbADs8KL/AAAAAAFl6QAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAAAAAAAAAAAAAA='
  let tx = new StellarSdk.Transaction(xdr1, StellarSdk.Networks.TESTNET)
  tx.sign(remitenteSignKeypair);
  
  //
  // env de completa garantia
  //xdr1 = 'AAAAAKYUL/A4wORIFVyeCo3hY2C/s0CZfwZtOq+bxaOgKkS6AAABkAAOFC0AAAACAAAAAQAAAABefqCdAAAAAF5+rq0AAAAAAAAABAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAAGAAAAAkZJREVMAAAAAAAAAAAAAAAZVNUd6DJSztbSqljhfLOF4RgsHS1Ve1wcRWwA7PCi/3//////////AAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAABAAAAAAAAAAEAAAAAcWtUbhpiozmmumwFKdMiqbzuR9QPxSXISoR7ubMxdWEAAAACRklERUwAAAAAAAAAAAAAABlU1R3oMlLO1tKqWOF8s4XhGCwdLVV7XBxFbADs8KL/AAAAAAFl6QAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAAAAAAEAAAAAznU4BYhZH5ZMyehfUi6ydHmDmsNWQxzmRzP3iOb8zGoAAAABAAAAAAAAAAA='
  //let tx = new StellarSdk.Transaction(xdr1, StellarSdk.Networks.TESTNET)
  //tx.sign(destinatarioSignKeypair);

  server.submitTransaction(tx)
  .catch(function(error) {
    console.log('-------------------------------------------------------');
    console.error('Something went wrong!', error.response.data.extras);
    console.log('-------------------------------------------------------');
  })
  .then(results => {
    console.log('-------------------------------------------------------');
    console.log("Reembolso de Garantia realizado");  
    console.log('Transaction           :', results._links.transaction.href)
    console.log('-------------------------------------------------------');
  })
})();

