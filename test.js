const faker = require('faker');

const amountOfCompanies = 100;

const clients = [...Array(1000).keys()].map(() => {
  return {
    clientCompanies: faker.random.number({min:2, max:30}),
    buyProcess: faker.random.number({min:0, max:10})
  };
})

const transactionsCompensationByRelatedCompanies = () => {
  let amountOfTransactions = 0;
  clients.forEach(({ clientCompanies, buyProcess }, index) => {
    amountOfTransactions += amountOfTransactions + (clientCompanies * buyProcess);
  })
  console.log('')
  console.log('Compensamos a los comercios del usuario')
  console.log('======================================');
  console.log(`Total transactions: ${amountOfTransactions}`);
  console.log('--------------------------------------');
  console.log(`Cost: ${0.00000050274 * amountOfTransactions} $`);
}

const transactionsEndOfBanch = () => {
  console.log('')
  console.log('Compensamos a todos los comercios')
  console.log('======================================');
  console.log(`Total transactions: ${amountOfCompanies}`);
  console.log('--------------------------------------');
  console.log(`Cost: ${0.00000050274 * amountOfCompanies} $`);
  console.log('')
}

transactionsCompensationByRelatedCompanies();
transactionsEndOfBanch();

