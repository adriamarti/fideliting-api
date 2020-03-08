const fetch = require('node-fetch');
const {
  Server, // Server handles the network connections.
  xdr,
  StrKey,
} = require('stellar-sdk');

const isTransactionOperation = (operation) => {
  if (operation._attributes
    && operation._attributes.body
    && operation._attributes.body._arm === 'paymentOp'
    && operation._attributes.body._value
    && operation._attributes.body._value._attributes
    && operation._attributes.body._value._attributes.asset) {
      return true;
    }

    return false;
}

const getCallParams = (url) => {
  const queryParams = url.split('?')[1];
  const params = queryParams.split('&');

  return {
    cursor: params[0].split('=')[1],
    limit: params[1].split('=')[1],
    order: params[2].split('=')[1],
  }
}

const getTrasnactionAjaxRequest = async (publicKey, cursor, limit, order) => {
  const stellarNetUrl = `${process.env.STELLAR_TEST_NET}`;
  const url = `${stellarNetUrl}/accounts/${publicKey}/transactions?cursor=${cursor}&limit=${limit}&order=${order}`

  try {
    const response = await fetch(url);

    const transactions = await response.json();

    return {
      records: transactions._embedded.records,
      self: getCallParams(transactions._links.self.href),
      next: getCallParams(transactions._links.next.href),
      prev: getCallParams(transactions._links.prev.href)
    };
  } catch (err) {
    throw(err);
  }

}

const getTransactions = async (publicKey, cursor = '', limit = 10, order = 'desc') => {
  try {
    let operations = [];
    const stellarServer = new Server(process.env.STELLAR_TEST_NET);

    // const { records } = await stellarServer.transactions().forAccount(publicKey).call();
    const { records, self, next, prev } = await getTrasnactionAjaxRequest(publicKey, cursor, limit, order)
    
    records.forEach(({ envelope_xdr, source_account }) => {
      const transactionDetails = xdr.TransactionEnvelope.fromXDR(envelope_xdr, 'base64');
      const paymentOperations = transactionDetails._attributes.tx._attributes.operations
        .filter((operation) => isTransactionOperation(operation))
        .map((operation) => {
          return {
            ...operation._attributes.body._value._attributes,
            sourceAccount: source_account
          }
        });
      
      operations = [...operations, ...paymentOperations];
    });

    const transactions = operations.map((operation) => {
      const currency = operation.asset._value._attributes.assetCode.toString();
      const amount = operation.amount.low / 10000000;
      const issuer = StrKey.encodeEd25519PublicKey(operation.asset._value._attributes.issuer._value);
      const destination = StrKey.encodeEd25519PublicKey(operation.destination._value);
      const { sourceAccount } = operation

      return { currency, amount, issuer, destination, sourceAccount }
    });

    return { operations: transactions, self, next, prev }

  } catch (err) {
    throw(err);
  }
}

module.exports = {
  getTransactions,
}