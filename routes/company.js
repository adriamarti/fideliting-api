const router = require('express').Router();
const bcrypt = require('bcryptjs');
// const stellar = require('stellar-sdk');
const User = require('../models/User');
const Company = require('../models/Company');
const {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  userRegisterValidationRequestPayload,
  userRegisterValidationPayload,
  userLoginValidationRequestPayload,
  userConfirmRegisterValidationPayload,
} = require('../services/validations');
const { verifyRegisterToken } = require('../middlewares/verifyToken');
const {
  getLoggedToken,
  getRegistrationToken,
} = require('../services/token');
const { sendConfirmRegistrationMail } = require('../services/send-mail');
const { encrypt, decrypt } = require('../services/encryptation');
const { createAccount } = require('../stellar/accounts');
const { buyFidels } = require('../stellar/buy');
const { getBalance } = require('../stellar/balance');

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
    const company = new Company(companyPayload)
    const savedCompany = await company.save()

    // Send confirmation email
    await sendConfirmRegistrationMail(
      savedCompany.email,
      savedCompany.name,
      getRegistrationToken(savedCompany._id),
    )

    return res.status(200).send(savedCompany);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// REGISTER CONFIRMATION
router.patch('/register-confirmation/:token', verifyRegisterToken, async (req, res) => {
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
      stellarAcount: {
        publicKey,
        privateKey,
      }
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

// BUY FIDELS
router.patch('/buy-fidels/:id', async (req, res) => {
  try {
    // Validate request data
    const validateBuyData = companyBuyFidelValidationRequestPayload(req.body);
    if (validateBuyData.error) {
      return res.status(400).send(validateCompanyData.error);
    }

    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    const buyFidelsTransaction = await buyFidels(company.stellarAcount.privateKey, req.body.amount);

    // @ TODO return not all data from transaction
    return res.status(200).send(buyFidelsTransaction);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// GET COMPANY BALANCE
router.get('/balance/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(400).send({
        message: 'Company does not exist',
      });
    };

    const companyBalance = await getBalance(company.stellarAcount.publicKey);

    // @ TODO return not all data from transaction
    return res.status(200).send(companyBalance);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

module.exports = router;