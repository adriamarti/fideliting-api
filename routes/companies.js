const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Company = require('../models/Company');
const {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  companyLoginValidationRequestPayload,
  userRegisterValidationRequestPayload,
  userRegisterValidationPayload,
  userLoginValidationRequestPayload,
  userConfirmRegisterValidationPayload,
} = require('../services/validations');
const {
  verifyRegisterToken,
  verifyLoginToken,
} = require('../middlewares/verifyToken');
const {
  getLoggedToken,
  getStellarAccountToken,
  getRegistrationToken,
  verifyToken,
} = require('../services/token');
const { sendConfirmRegistrationMail } = require('../services/send-mail');
const { encrypt, decrypt } = require('../services/encryptation');
const { createAccount } = require('../stellar/accounts');
const { buyFidels } = require('../stellar/buy');
const { getBalance } = require('../stellar/balance');
const { getTransactions } = require('../stellar/transactions')

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

    return res.status(200).send(savedCompany);
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

    // Create Stellar Address
    const { transactionData, publicKey, privateKey } = await createAccount();

    const dataToUpdate = {
      status: 'active',
      phone: req.body.phone,
      sector: req.body.sector,
      location: req.body.location,
      nif: req.body.nif,
      stellarAcount: getStellarAccountToken(publicKey, privateKey),
    }

    // Update Company Data
    const query = { _id: req.user._id };
    const update = { $set: dataToUpdate };
    const updatedCompany = await Company.updateOne(query, update);
    
    // @ TODO return not all data from company
    return res.status(200).send(updatedCompany);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
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
  const { publicKey } = verifyToken(registeredCompany.stellarAcount);
  const balance = await getBalance(publicKey);

  // console.log(registeredCompany)

  // Remove password and stellarAccount from company data
  const { _id, email, name, location, nif, phone, sector } = registeredCompany;

  console.log('---------------------------------------');
  console.log('Login Token');
  console.log('---------------------------------------');
  console.log(token);
  console.log('---------------------------------------');

  return res
    .cookie('login_fideliting_token', token, {
      expires: new Date(Date.now() + 24 * 3600000) // cookie will be removed after 24 hours
    })
    .send({_id, email, name, location, nif, phone, sector, balance});
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

    const { privateKey } = verifyToken(company.stellarAcount)

    const buyFidelsTransaction = await buyFidels(privateKey, req.body.amount);

    return res.status(200).send(buyFidelsTransaction);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// GET COMPANY BALANCE
router.get('/balance/:id', verifyLoginToken, async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    const { publicKey } = verifyToken(company.stellarAcount)

    const companyBalance = await getBalance(publicKey);

    return res.status(200).send(companyBalance);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// GET COMPANIES
router.get('/list', async (req, res) => {
  try {
    const companies = await Company
      .find({
      status: 'active',
      stellarAcount: { $exists: true }
      })
      .select('-password -stellarAcount -status -nif');

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