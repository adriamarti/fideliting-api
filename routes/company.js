const router = require('express').Router();
const bcrypt = require('bcryptjs');
// const stellar = require('stellar-sdk');
const User = require('../models/User');
const Company = require('../models/Company');
const {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
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
    // @todo código de Ignacio para obtener clave públilca y privada
    // const dataToUpdate = {
    //   status: 'active',
    //   stellarAccount: keypair.publicKey(),
    //   stellarSeed: encrypt(keypair.secret(), process.env.STELLAR_ENCRYPT_SECRET),
    // }

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
    
    // @ TODO return not all data from user
    return res.status(200).send(updatedCompany);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

module.exports = router;