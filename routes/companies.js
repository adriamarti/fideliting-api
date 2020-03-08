const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Company = require('../models/Company');
const {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  companyLoginValidationRequestPayload,
  companyGetTransactionsValidationRequestPayload,
} = require('../services/validations');
const {
  verifyRegisterToken,
  verifyLoginToken,
} = require('../middlewares/verifyToken');
const {
  getLoggedToken,
  getRegistrationToken,
} = require('../services/token');
const { sendConfirmRegistrationMail } = require('../services/send-mail');
const { encrypt, decrypt } = require('../services/encryptation');
const { createAccount } = require('../stellar/accounts');
const { buyFidels } = require('../stellar/buy');
const { getBalance } = require('../stellar/balance');
const { getTransactions } = require('../stellar/transactions');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // Validate request data
    const validateCompanyData = companyRegisterValidationRequestPayload(req.body);
    if (validateCompanyData.error) {
      return res.status(400).send(validateCompanyData.error);
    }

    // Check if Email is already registered
    const registeredCompany = await Company.findOne({ email: req.body.email });
    if (registeredCompany) {
      return res.status(400).send({
        message: `Company with ${req.body.email} email is already registered`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create company payload to be stored in DB
    const companyPayload = {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      status: 'inactive',
    };
    
    // Save Company in the DB
    const company = new Company(companyPayload);
    const savedCompany = await company.save();

    console.log('---------------------------------------');
    console.log('Confirm Registration Token');
    console.log('---------------------------------------');
    console.log(getRegistrationToken(savedCompany._id));
    console.log('---------------------------------------');

    // Send confirmation email
    // await sendConfirmRegistrationMail(
    //   savedCompany.email,
    //   savedCompany.name,
    //   getRegistrationToken(savedCompany._id),
    // )

    const { name, email } = savedCompany;

    return res.status(200).send({ name, email });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// REGISTER CONFIRMATION
router.patch('/register-confirmation', verifyRegisterToken, async (req, res) => {
  try {
    // Validate request data
    const validateCompanyData = companyRegisterConfirmationValidationRequestPayload(req.body);
    if (validateCompanyData.error) {
      return res.status(400).send(validateCompanyData.error);
    }

    // Check if Email is not registered
    const registeredCompany = await Company.findById(req.user._id);
    if (!registeredCompany) {
      return res.status(400).send({
        message: `Company with ${req.body.email} email is not registered`,
      });
    }

    // Create Stellar Address
    const { transactionData, publicKey, secret } = await createAccount();

    const dataToUpdate = {
      status: 'active',
      phone: req.body.phone,
      sector: req.body.sector,
      location: req.body.location,
      nif: req.body.nif,
      publicKey,
      secret: encrypt(secret),
    }

    // Update Company Data
    const query = { _id: req.user._id };
    const update = { $set: dataToUpdate };
    const updatedCompany = await Company.updateOne(query, update);
    
    return res.status(200).send(updatedCompany);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    // Validate request data
    const validateCompanyData = companyLoginValidationRequestPayload(req.body);
    if (validateCompanyData.error) {
      return res.status(400).send(validateCompanyData.error);
    }

    // Check if Email is not registered
    const registeredCompany = await Company.findOne({ email: req.body.email });
    if (!registeredCompany) {
      return res.status(400).send({
        message: `Company with ${req.body.email} email is not registered`,
      });
    }

    // Check if Password is correct
    const checkValidPassword = await bcrypt.compare(req.body.password, registeredCompany.password);
    if (!checkValidPassword) {
      return res.status(400).send({
        message: `Password is incorrect`,
      });
    }

    // Create a JSON WEB TOKEN
    const token = getLoggedToken(registeredCompany._id);

    // Get Company balance
    const balance = await getBalance(registeredCompany.publicKey);

    // Get Company transactions
    const transactions = await getTransactions(registeredCompany.publicKey);

    // Company data to be returned
    const { _id, email, name, location, nif, phone, sector, publicKey } = registeredCompany;

    console.log('---------------------------------------');
    console.log('Login Token');
    console.log('---------------------------------------');
    console.log(token);
    console.log('---------------------------------------');

    return res
      .cookie('login_fideliting_token', token, {
        expires: new Date(Date.now() + 24 * 3600000) // cookie will be removed after 24 hours
      })
      .send({_id, email, name, location, nif, phone, sector, balance, publicKey, transactions});

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// BUY FIDELS
router.patch('/buy-fidels/:id', verifyLoginToken, async (req, res) => {
  try {
    // Validate request data
    const validateBuyData = companyBuyFidelValidationRequestPayload(req.body);
    if (validateBuyData.error) {
      return res.status(400).send(validateCompanyData.error);
    }

    const company = await Company.findById(req.user._id);

    if (!company) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    const buyFidelsTransaction = await buyFidels(decrypt(company.secret), req.body.amount);

    return res.status(200).send(buyFidelsTransaction);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// BUY FIDELS
router.get('/transactions/:id', verifyLoginToken, async (req, res) => {
  try {
    // Validate request data
    const validateTransactionData = companyGetTransactionsValidationRequestPayload(req.body);
    if (validateTransactionData.error) {
      return res.status(400).send(validateTransactionData.error);
    }

    const company = await Company.findById(req.user._id);

    if (!company) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    // Get Company transactions
    const { cursor, limit, order } = req.body;
    const transactions = await getTransactions(company.publicKey, cursor, limit, order);

    return res.status(200).send(transactions);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// Transfer FIDELs to a client
router.patch('/transfer-fidels/:id', verifyLoginToken, async (req, res) => {
  try {
    // Validate request data
    const validateTransactionData = companyTransactionToCompanyValidationRequestPayload(req.body);
    if (validateTransactionData.error) {
      return res.status(400).send(validateTransactionData.error);
    }

    const company = await Company.findById(req.user._id);

    if (!company) {
      return res.status(400).send({
        message: 'Client does not exist',
      });
    };

    const client = await Client.findById(req.body.clientId);

    if (!client) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    // Check if company have enough FIDELs
    const companyBalances = await getBalance(company.publicKey);
    if (+companyBalances.FIDELS < +req.body.amount) {
      return res.status(400).send({
        message: 'Client do not have engough Fidels',
      });
    }

    const buyFidelsTransaction = await buyFidels(privateKey, req.body.amount);

    return res.status(200).send(buyFidelsTransaction);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// GET COMPANIES
router.get('/list', async (req, res) => {
  try {
    const companies = await Company
      .find({ status: 'active' })
      .select('-password -secret -status -nif');

    if (!companies.length) {
      return res.status(400).send({
        message: 'No active companies in the platform',
      });
    };

    return res.status(200).send(companies);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

module.exports = router;