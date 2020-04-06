/*
//Cuenta FIDEL
FidelSecret = 'SAV6QKDNWUNEERAAB3F46WH2NBZMHIN3DM67ZFI7YPOE45PIK7GI66VW';
FidelPublic = 'GAMVJVI55AZFFTWW2KVFRYL4WOC6CGBMDUWVK624DRCWYAHM6CRP7PKT';

//Cuenta SFIDEL
const sFidelSecret = 'SDJ2PC6VRCD6EZ2J5WSARGX3YOARPS73P4RJ532BTYQ6OXGQGYZGSRV7';
const sFidelPublic = 'GBOIBL7R2QG5I2MWSH4AFBIFRQ5MAXMEZEVIVMT5ZP2HOD4H3CFFRSWE';

//Cuenta COMPENSATORIA
const CompensaSecret = 'SDBU5PYDDD6ZUQFW53AOMP2NBP5OOHXPYR6LGB26ALMA4GN6P6RFTBVD';
const CompensaPublic = 'GC63X7GK7ES5BB6GE3Z3SBZHBFUQEXOTVHMR5JVBB2RTUTT4UTL34OXU';

//Cuenta sociedad fideliting
CtaCiaFidelitingSecr = 'SCUUURKD2UJC2ZSLRQMDGGCQ3ORESTQJ5ZXI7NU7GT65UDLPGMKDIQ36';
CtaCiaFidelitingPubl = 'GDYFWPNPZQI3SEY4NWDHE6TLLC66JETIEI5BKS32NYOT626PFSGPYL4P';

//Cuenta comercio1
CtaComercio1Secr = 'SAZVZEUVSWO2R7EDRKV4C4SCFORQVHDYJ4H4NYBRMYTIQQV6FVYO6QQN';
CtaComercio1Publ = 'GCTK5BZCQPXN6EGXZHJPOVPFGTXLMPGNJW5ZFHUPEHKZ42N5EG4QVPWN';

//Cuenta comercio2
CtaComercio2Secr = 'SBPIRTMNOE5K7EMVZQSFAWPKBYB6F63PSCTMUIIIP45PBBYWGPPCHZU3';
CtaComercio2Publ = 'GAOV7XX65C4NDUGN2LQSKMEPDGHONKBWCOCD45NP37J4SCYNOKBROVV6';

//Cuenta comercio3
CtaComercio3Secr = 'SAMWURQXW24XITBSODGNADDJWL2AGJB5Y6MW23S47HIGOAMG7GY7SCOH';
CtaComercio3Publ = 'GCPDDFLRQEELJOLSNSGABJQ63M7W35O62S7IKDJBGP3X255LO3GMZ3PY';

//Cuenta cliente1
const Clt1Secret = 'SDEG5XH5DZKZ3KUU5VGTTMJ375HEXN3KSBSU664SVDCLXRXLYTKIBCK2';
const Clt1Public = 'GADTUAMIK6IFZEL6H24LHLXXCN7GO7A4PQNKVRPBXOL444TXISFWB6E6';

//Cuenta cliente2
const Clt2Secret = 'SBXP7VMUI6YVU6BENDOPXELS6HOERIHI52EIEMWJOSZINHFKAXTL5S4R';
const Clt2Public = 'GCUZECQIWYSCIH6IMSL6RPJZTUFHXJ2CDKONA4TGQRUZ2EFGEZJF47BK';

//Cuenta cliente3
const Clt3Secret = '';
const Clt3Public = '';

const StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

// INICIO datos de entrada
// INICIO datos de entrada
// INICIO datos de entrada 
//let ComercioAccountSecretKey = "SCI3NNDBLR7AO25L7TL7OBHAWEUZENIEOQ5ZYTK2OVULA23KTAEC37A7";
//let ClienteAccountSecretKey = "SBYWBDUBK2AKCSWVSJWEQV4MAGWT7BW6LSENUSG37CE6RC4HQAHEJLIG";

let ComercioAccountSecretKey = CtaComercio1Secr;
let ClienteAccountSecretKey = Clt2Secret;


amount = 26;
Points = 2.44;
// FIN datos de entrada
let PorcentageFIDEL = 0.01; // porcentaje para la generacion de FIDEL al cliente
let PorcentageSFIDEL = 0.005; // porcentaje para la generacion de SFIDEL al comercio
let PorcentageSFIDELcia = 0.0015; // porcentaje para la generacion de SFIDEL a FIDELITING

let PuntosFIDEL = amount * PorcentageFIDEL
let PuntosSFIDEL = amount * PorcentageSFIDEL
let PuntosSFIDELcia = amount * PorcentageSFIDELcia

console.log("PuntosFIDEL    : ", PuntosFIDEL.toString());
console.log("PuntossFIDEL   : ", PuntosSFIDEL);
console.log("PuntossFIDELcia: ", PuntosSFIDELcia);

(async function ValiaSaldoFidelCliente() {
    source3 = StellarSdk.Keypair.fromSecret(ClienteAccountSecretKey);
    sourceAccount3 = await server.loadAccount(source3.publicKey())

    // obtención del balance FIDEL
    let balanceFidel = 0;
    sourceAccount3.balances.forEach(function(balance) {
        //console.log("balance.asset_code", balance.asset_code);
        currency = balance.asset_code
        if (currency && currency.substr(0,5) == "FIDEL"){
            balanceFidel = balance.balance;
        }
    });
    if( balanceFidel < Points ) {
        console.log("Saldo de puntos del cliente insuficiente.");
        return -1;
    }
})();

//
// se transfieren FIDEL al cliente por la compra realizada
let source = StellarSdk.Keypair.fromSecret(ComercioAccountSecretKey);
let dest = StellarSdk.Keypair.fromSecret(ClienteAccountSecretKey);
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
        amount: PuntosFIDEL.toString()
    }))
    
    builder.setTimeout(180);

    let tx1 = builder.build()
    tx1.sign(source)
    tx1.sign(dest)
    
    let txResult = await server.submitTransaction(tx1)
    .catch(function(error) {
        console.log('-------------------------------------------------------');
        console.error('1 Something went wrong!', error);
        console.log('-------------------------------------------------------');
    })
    .then(results => {
        console.log('-------------------------------------------------------');
        console.log('Transaction1:', results._links.transaction.href)
        console.log('-------------------------------------------------------');
    //  console.log('Transaction:', results)
    })
})();

// se transfieren SFIDEL al comercio como recompensa de los FIDEL emitidos y a FIDELITING 
// en concepto de comision.
source2 = StellarSdk.Keypair.fromSecret(sFidelSecret);
dest2 = StellarSdk.Keypair.fromSecret(ComercioAccountSecretKey);
dest4 = StellarSdk.Keypair.fromSecret(CtaCiaFidelitingSecr);
(async function main2() {
    sourceAccount2 = await server.loadAccount(source2.publicKey())

    builder2 = new StellarSdk.TransactionBuilder(sourceAccount2, 
        {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET}
    );

    builder2.addOperation(StellarSdk.Operation.changeTrust({ // linea de confianza entre SFIDEL y Compañia
        asset: new StellarSdk.Asset('SFIDEL', sFidelPublic),
        source: dest2.publicKey()
    }))
    builder2.addOperation(StellarSdk.Operation.changeTrust({  // linea de confianza entre SFIDEL y FIDELITING
        asset: new StellarSdk.Asset('SFIDEL', sFidelPublic),
        source: dest4.publicKey()
    }))

    builder2.addOperation(StellarSdk.Operation.payment({  // pago a la compañia de los SFIDEL
        destination: dest2.publicKey(),
        asset: new StellarSdk.Asset('SFIDEL', sFidelPublic),
        amount: PuntosSFIDEL.toString()
    }))
    builder2.addOperation(StellarSdk.Operation.payment({ // pago a la FIDELITING de los SFIDEL 
        destination: dest4.publicKey(),
        asset: new StellarSdk.Asset('SFIDEL', sFidelPublic),
        amount: PuntosSFIDELcia.toString() 
    }))
    
    builder2.setTimeout(180);
    tx2 = builder2.build()
    tx2.sign(source2)
    tx2.sign(dest2)
    tx2.sign(dest4)
    
    txResult2 = await server.submitTransaction(tx2)
    .catch(function(error) {
        console.log('-------------------------------------------------------');
        console.error('2 Something went wrong!', error.response.data.extras);
        console.log('-------------------------------------------------------');
    })
    .then(results => {
        console.log('-------------------------------------------------------');
        console.log('Transaction2:', results._links.transaction.href)
        console.log('-------------------------------------------------------');
    })
})();

// se transfieren los FIDEL pagados por el cliente a la cuenta compensatoria
source3 = StellarSdk.Keypair.fromSecret(ClienteAccountSecretKey);
dest3 = StellarSdk.Keypair.fromSecret(CompensaSecret);
(async function main3() {
    sourceAccount3 = await server.loadAccount(source3.publicKey())

    builder3 = new StellarSdk.TransactionBuilder(sourceAccount3, 
        {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET}
    );

    builder3.addOperation(StellarSdk.Operation.changeTrust({ 
        asset: new StellarSdk.Asset('FIDEL', FidelPublic),
        source: dest3.publicKey()
    }))
    
    builder3.addOperation(StellarSdk.Operation.payment({ 
        destination: dest3.publicKey(),
        asset: new StellarSdk.Asset('FIDEL', FidelPublic),
        amount: Points.toString() 
    }))
    
    builder3.setTimeout(180);
    tx3 = builder3.build()
    tx3.sign(source3)
    tx3.sign(dest3)
    
    txResult3 = await server.submitTransaction(tx3)
    .catch(function(error) {
        console.log('-------------------------------------------------------');
        console.error('3 Something went wrong!', error);
        console.log('-------------------------------------------------------');
    })
    .then(results => {
        console.log('-------------------------------------------------------');
        console.log('Transaction3:', results._links.transaction.href)
        console.log('-------------------------------------------------------');
    })
})();
*/