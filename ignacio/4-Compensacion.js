/*
var StellarSdk = require('stellar-sdk');
const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const FidelFEE = 0.06;
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
CtaCiaFIDELITINGSecr = 'SCUUURKD2UJC2ZSLRQMDGGCQ3ORESTQJ5ZXI7NU7GT65UDLPGMKDIQ36';
CtaCiaFIDELITINGPubl = 'GDYFWPNPZQI3SEY4NWDHE6TLLC66JETIEI5BKS32NYOT626PFSGPYL4P';

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

let PorcentageFIDEL = 0.01; // porcentaje para la generacion de FIDEL al cliente
let PorcentageSFIDEL = 0.005; // porcentaje para la generacion de SFIDEL al comercio
let PorcentageSFIDELcia = 0.0015; // porcentaje para la generacion de SFIDEL a FIDELITING


// entrada
let CTApublic = [CtaComercio1Publ,CtaComercio2Publ,CtaComercio3Publ];
let CTAsecret = [CtaComercio1Secr,CtaComercio2Secr,CtaComercio3Secr];


let currency = "";
let CTAissuer;
let CTAfrom;
let CTAto;
let amount = 0;
let FIDELvendido = 0;
let FIDELcompensado = 0;
let FIDELpendiente = 0;
let totalFIDEL = 0;
let comercioCTAS = new Array(); 
let comercioSaldo = new Array(); 
let comercioPercent = new Array(); 

(async function main() {
    for (j=0; j < CTApublic.length ; j++) {
        // carga el historico de transacciones del comercio j
        // por cada comercio se obtienen los pagos de FIDEL enviados a cliente y los 
        // pagos recibidos de la compensación de los FIDEL canjeados en compras.
        // con estos dos importes se obtiene el saldo de FIDEL pendiente de compensar por el comercio.
        // Con este FIDEL pendiente y el acumulado de todos los pendientes de los comercios se 
        // calculará posteriormente el porcentaje de cada uno. 
        let historyPage = await server.transactions().forAccount(CTApublic[j]).call()

        comercioCTAS.push (CTAsecret[j])

        SFIDELrecompensa = 0;
        FIDELvendido = 0;
        FIDELcompensado = 0;
        FIDELpendiente = 0;
        let hasNext = true
        while(hasNext) {
            if(historyPage.records.length === 0) {
                //console.log("\nNo more transactions!")
                hasNext = false
            } 
            else 
            {
                for (i=0 ;i<historyPage.records.length; i++) 
                {
                    let txDetails = StellarSdk.xdr.TransactionEnvelope.fromXDR(historyPage.records[i].envelope_xdr, 'base64')
                    txDetails._attributes.tx._attributes.operations.map(operation => { 
                        // en este proceso solo interesa las operaciones de pago (paymentOp) de FIDEL
                        // que sean: 
                        // 1 de salida (from del comercio). Son los FIDEL vendidos
                        // 2 de entrada (TO del comercio) y proviniente de la cuenta de compensacion. Son los FIDEL compensados 
                        if (operation._attributes.body._arm == 'paymentOp') { // operacion de pago
                            //console.log("Moneda : ", operation._attributes.body._value._attributes.asset._value._attributes.assetCode.toString() );
                            //console.log("Importe: ", operation._attributes.body._value._attributes.amount.low );
                            //console.log("Emisor : ", StellarSdk.StrKey.encodeEd25519PublicKey(operation._attributes.body._value._attributes.asset._value._attributes.issuer._value));
                            //console.log("Origen : ", historyPage.records[i].source_account);
                            //console.log("Destino: ", StellarSdk.StrKey.encodeEd25519PublicKey(operation._attributes.body._value._attributes.destination._value));
                            CTAissuer = StellarSdk.StrKey.encodeEd25519PublicKey(operation._attributes.body._value._attributes.asset._value._attributes.issuer._value);
                            CTAfrom = historyPage.records[i].source_account;
                            CTAto = StellarSdk.StrKey.encodeEd25519PublicKey(operation._attributes.body._value._attributes.destination._value); 
                            currency = operation._attributes.body._value._attributes.asset._value._attributes.assetCode.toString()        
                            amount = 0
                            if (currency.substr(0,5) == "FIDEL") {
                                if (CTApublic[j] == CTAfrom) { 
                                    // La cuenta from del pago es el comercio. El comercio está enviando puntos a cliente
                                    //amount = operation._attributes.body._value._attributes.amount.low;
                                    //FIDELvendido += amount;
                                } else {
                                    if ((CTAto == CTApublic[j]) && (CTAfrom == CompensaPublic))  {
                                        // La cuenta TO del pago es el comercio. El comercio está recibiendo puntos del proceso de compensación
                                        amount = operation._attributes.body._value._attributes.amount.low * -1;
                                        FIDELcompensado += amount;
                                    }
                                }
                            }
                            if (currency.substr(0,6) == "SFIDEL") {
                                if (CTApublic[j] == CTAfrom) { 
                                    // La cuenta from del pago es el comercio. El comercio está enviando puntos a cliente
                                    //amount = operation._attributes.body._value._attributes.amount.low;
                                    //FIDELvendido += amount;
                                } else {
                                    if ((CTAto == CTApublic[j]) && (CTAfrom == sFidelPublic))  {
                                        // La cuenta TO del pago es el comercio. El comercio está recibiendo SFIDEL como recompensa de venta
                                        amount = operation._attributes.body._value._attributes.amount.low * -1;
                                        SFIDELrecompensa += amount;
                                    }
                                }
                            }
                        }
                    })
                }
                historyPage = await historyPage.next()
            }
        }

        PuntosFIDEL = amount * PorcentageFIDEL
        PuntosSFIDEL = amount * PorcentageSFIDEL
        PuntosSFIDELcia = amount * PorcentageSFIDELcia
        
        amount = (SFIDELrecompensa / PorcentageSFIDELcia).toFixed(2);
        FIDELvendido = amount * PorcentageFIDEL;

        // calculo de los FIDEL pendientes de recibir en compensaciones futuras = 
        // FIDEL emitidos a clientes - comision mantenimiento - FIDEL ya recibidos del proceso de compensación
        FIDELpendiente = FIDELvendido - ((FIDELvendido - FIDELcompensado) * FidelFEE) - FIDELcompensado
        //console.log("FIDELvendido    = ", FIDELvendido)
        //console.log("FIDELcompensado = ", FIDELcompensado)
        //console.log("FIDELpendiente  = ", FIDELpendiente)
        if (FIDELpendiente < 0) {
            FIDELpendiente = 0;
        }
        // PUSH de los FIDEL pendientes de recibir en compensación por el comercio
        comercioSaldo.push (FIDELpendiente/10000000)
        // acumular el total para la obtención posterior del porcentaje de reparto
        totalFIDEL += FIDELpendiente/10000000
    }
    //
    // proceso de calculo del porcentaje de reparto de cada comercio
    acumPercent = 0;
    for (j= 0; j < comercioSaldo.length; j++) {
        if (j == comercioSaldo.length - 1) {
            // es el ultimo comercio. Se ajusta el porcentaje para evitar desajustes por redondeo.
            percent = 100 - acumPercent;
        } else {
            // calculo del porcentaje correspondiente al comercio j
            percent = comercioSaldo[j]*100/totalFIDEL;
        }
        acumPercent = acumPercent + percent;
        comercioPercent.push (percent); 
    }
    //
    // obtención del importe FIDEL a compensar
    let account = await server.loadAccount(CompensaPublic);
    balanceTransfer = 0;
    account.balances.forEach(function(balance) {
        //console.log("balance.asset_code", balance.asset_code);
        currency = balance.asset_code
        if (currency && currency.substr(0,5) == "FIDEL"){
            balanceTransfer = balance.balance;
        }
    });
    TransferAcum = 0;
    //
    // realizacion de la transaccion:
    if (balanceTransfer != 0){
        
        // calculo de los FIDEL a emitir como comisión de mantenimiento del sistema para FIDELITING
        TransferSociety = (balanceTransfer * FidelFEE).toFixed(7);
        // Se descuenta la comisión de mantenimiento del importe a compensar entre comercios
        balanceTransfer = balanceTransfer - (TransferSociety * 1);

        // instanciado del transaction Builder
        source = StellarSdk.Keypair.fromSecret(CompensaSecret);
        sourceAccount = await server.loadAccount(source.publicKey())        
        builder = new StellarSdk.TransactionBuilder(sourceAccount, 
            {fee: StellarSdk.BASE_FEE, networkPassphrase: StellarSdk.Networks.TESTNET}
        );
        //
        // Se insertan las operaciones para el pago de la comision de mantenimiento que recibe FIDELITING
        dest = StellarSdk.Keypair.fromSecret(CtaCiaFIDELITINGSecr); 
        builder.addOperation(StellarSdk.Operation.changeTrust({ // linea de confianza
            asset: new StellarSdk.Asset('FIDEL', FidelPublic),
            source: dest.publicKey()
        }))        
        builder.addOperation(StellarSdk.Operation.payment({ // operacion de pago
            destination: dest.publicKey(),
            asset: new StellarSdk.Asset('FIDEL', FidelPublic),
            amount: TransferSociety 
        }))

        // bocle de pago de las compensaciones a los comercios
        for (j= 0; j < comercioPercent.length; j++) {
            // calculo del importe que recibe en la compensacion el comercio j
            if (j == comercioPercent.length - 1){
                TransAmount = (balanceTransfer - TransferAcum).toFixed(7);
            } else {
                TransAmount = (comercioPercent[j] * balanceTransfer / 100).toFixed(7);
            }
            TransferAcum = TransferAcum + (TransAmount * 1)

            dest = StellarSdk.Keypair.fromSecret(CTAsecret[j]);
            builder.addOperation(StellarSdk.Operation.changeTrust({ // linea de confianza
                asset: new StellarSdk.Asset('FIDEL', FidelPublic),
                source: dest.publicKey()
            }))
            builder.addOperation(StellarSdk.Operation.payment({ // operacion de pago al comercio j
                destination: dest.publicKey(),
                asset: new StellarSdk.Asset('FIDEL', FidelPublic),
                amount: TransAmount 
            }))
            console.log("TransAmount", TransAmount);
        }
        builder.setTimeout(180);
        tx = builder.build();
        //
        // firmas
        tx.sign(source);
        dest = StellarSdk.Keypair.fromSecret(CtaCiaFIDELITINGSecr); 
        tx.sign(dest);
        for (j= 0; j < comercioPercent.length; j++) {  
            dest = StellarSdk.Keypair.fromSecret(CTAsecret[j]);          
            tx.sign(dest);
        }
        //
        // lanzamiento de la transaccion
        txResult = await server.submitTransaction(tx)
        .catch(function(error) {
            console.error('Something went wrong!', error);
        })
        .then(results => {
            console.log('Transaction:', results._links.transaction.href)
        })
        console.log("TransferAcum", TransferAcum);  
    } else {
        console.log("Sin fondos para compensar");  
    }
})();
*/