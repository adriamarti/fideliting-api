const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Client = require('../models/Client');
const {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  companyLoginValidationRequestPayload,
  clientRegisterValidationRequestPayload,
  clientLoginValidationRequestPayload,
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
    const validateClientData = clientRegisterValidationRequestPayload(req.body);
    if (validateClientData.error) {
      return res.status(400).send(validateClientData.error);
    }

    // Check if Email is already registered
    const registeredClient = await Client.findOne({ email: req.body.email });
    if (registeredClient) {
      return res.status(400).send({
        message: `Client with ${req.body.email} email is already registered`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create Client payload to be stored in DB
    const clientPayload = {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      status: 'inactive',
    };
    
    // Save Client in the DB
    const client = new Client(clientPayload);
    const savedClient = await client.save();

    console.log('---------------------------------------');
    console.log('Confirm Registration Token');
    console.log('---------------------------------------');
    console.log(getRegistrationToken(savedClient._id));
    console.log('---------------------------------------');

    // Send confirmation email
    // await sendConfirmRegistrationMail(
    //   savedCompany.email,
    //   savedCompany.name,
    //   getRegistrationToken(savedCompany._id),
    // )

    const { name, email } = savedClient;

    return res.status(200).send({ name, email });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// REGISTER CONFIRMATION
router.patch('/register-confirmation', verifyRegisterToken, async (req, res) => {
  try {
    // Check if user is already registered
    const registeredClient = await Client.findById(req.user._id);
    if (!registeredClient) {
      return res.status(400).send({
        message: `Your confirm registration link is invalid.`,
      });
    }

    // Create Stellar Address
    const { transactionData, publicKey, privateKey } = await createAccount();

    const dataToUpdate = {
      status: 'active',
      stellarAcount: getStellarAccountToken(publicKey, privateKey),
    }

    // Update Client Data
    const query = { _id: req.user._id };
    const update = { $set: dataToUpdate };
    const updatedCompany = await Client.updateOne(query, update);
    
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
    const validateClientData = clientLoginValidationRequestPayload(req.body);
    if (validateClientData.error) {
      return res.status(400).send(validateClientData.error);
    }

    // Check if Email is not registered
    const registeredClient = await Client.findOne({ email: req.body.email });
    if (!registeredClient) {
      return res.status(400).send({
        message: `Client with ${req.body.email} email is not registered`,
      });
    }

    // Check if Password is correct
    const checkValidPassword = await bcrypt.compare(req.body.password, registeredClient.password);
    if (!checkValidPassword) {
      return res.status(400).send({
        message: `Password is incorrect`,
      });
    }

    // Create a JSON WEB TOKEN
    const token = getLoggedToken(registeredClient._id);

    // Get Client balance
    const { publicKey } = verifyToken(registeredClient.stellarAcount);
    const balance = await getBalance(publicKey);

    // Remove password and stellarAccount from client data
    const { _id, email, name, location, nif, phone, sector } = registeredClient;

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

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
  
})

// GET CLIENTS
router.get('/list', async (req, res) => {
  try {
    const clients = await Client
      .find({ status: 'active' })
      .select('-password -stellarAcount -status');

    if (!clients.length) {
      return res.status(400).send({
        message: 'No active clients in the platform',
      });
    };

    return res.status(200).send(clients);

  } catch(err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

module.exports = router;