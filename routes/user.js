const router = require('express').Router();
const bcrypt = require('bcryptjs');
const stellar = require('stellar-sdk');
const User = require('../models/User');
const {
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
    const validateUserData = userRegisterValidationRequestPayload(req.body);
    if (validateUserData.error) {
      return res.status(400).send(validateUserData.error);
    }

    // Check if Email is already registered
    const registeredUser = await User.findOne({ email: req.body.email });
    if (registeredUser) {
      return res.status(400).send({
        message: `User with ${req.body.email} email is already registered`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create user payload to be stored in DB
    const userPayload = {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      type: req.body.type,
      status: 'inactive',
    };

    // Validate user payload to be stored in DB
    const validateUserPayload = userRegisterValidationPayload(userPayload);
    if (validateUserPayload.error) {
      return res.status(400).send(validateUserData.error);
    }
    
    // Save User in the DB
    const user = new User(userPayload)
    const savedUser = await user.save()

    // Send confirmation email
    await sendConfirmRegistrationMail(
      savedUser.email,
      savedUser.name,
      getRegistrationToken(savedUser._id),
    )

    // @ TODO return not all data from user
    return res.status(200).send(savedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// REGISTER CONFIRMATION
router.patch('/register-confirmation/:token', verifyRegisterToken, async (req, res) => {
  try {
    // Create Stellar Address
    const keypair = stellar.Keypair.random();
    // const dataToUpdate = {
    //   status: 'active',
    //   stellarAccount: keypair.publicKey(),
    //   stellarSeed: encrypt(keypair.secret(), process.env.STELLAR_ENCRYPT_SECRET),
    // }

    const dataToUpdate = {
      status: 'active',
      stellarAccount: keypair.publicKey(),
      stellarSeed: keypair.secret(),
    }

    // Validate data to be uploaded into DB
    const validateUserData = userConfirmRegisterValidationPayload(dataToUpdate);
    if (validateUserData.error) {
      return res.status(400).send(validateUserData.error);
    }

    // Create User into Stellar Network
    const stellarUser = await createAccount(keypair.secret());
    console.log(stellarUser);

    // Update User Data
    const query = { _id: req.user._id };
    const update = { $set: dataToUpdate };
    const updatedUser = await User.updateOne(query, update);
    
    // @ TODO return not all data from user
    return res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

module.exports = router;