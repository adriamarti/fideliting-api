const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {
  userRegisterValidationRequestPayload,
  userRegisterValidationPayload,
  userLoginValidationRequestPayload
} = require('../services/validations');
const { verifyRegisterToken } = require('../middlewares/verifyToken');
const {
  getLoggedToken,
  getRegistrationToken,
} = require('../services/token');
const { sendConfirmRegistrationMail } = require('../services/send-mail');
const { createAccount } = require('../kaleido-api/accounts');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    // Validate request data
    // const validateUserData = userRegisterValidationRequestPayload(req.body);
    // if (validateUserData.error) {
    //   return res.status(400).send(validateUserData.error);
    // }

    // Check if Email is already registered
    const registeredUser = await User.findOne({ email: req.body.email });
    // if (registeredUser) {
    //   return res.status(400).send({
    //     message: `User with ${req.body.email} email is already registered`,
    //   });
    // }

    // const { address } = await createAccount(process.env.KALEIDO_ADDRESS_PSW);

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create user payload to be stored in DB
    const userPayload = {
      email: req.body.email,
      password: hashedPassword,
      type: req.body.type,
      status: 'inactive',
    };

    // Validate user payload to be stored in DB
    // const validateUserPayload = userRegisterValidationPayload(userPayload);
    // if (validateUserPayload.error) {
    //   return res.status(400).send(validateUserData.error);
    // }
    
    // Save User in the DB
    // const user = new User(userPayload)
    // const savedUser = await user.save()

    // Send confirmation email
    const email = await sendConfirmRegistrationMail(
      userPayload.email,
      getRegistrationToken(userPayload._id),
    )

    // @ TODO return not all data from user
    return res.status(200).send(email);
    // return res.status(200).send(savedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
})

// VERIFY ACCOUNT


// RANDOM
router.patch('/verify/:token', verifyRegisterToken, async (req, res) => {
  res.json(req.user);
})
router.post('/verify', async (req, res) => {
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

    const { address } = await createAccount(process.env.KALEIDO_ADDRESS_PSW);

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Create user payload to be stored in DB
    const userPayload = {
      email: req.body.email,
      password: hashedPassword,
      type: req.body.type,
      address: `0x${address}`,
    };

    // Validate user payload to be stored in DB
    const validateUserPayload = userRegisterValidationPayload(userPayload);
    if (validateUserPayload.error) {
      return res.status(400).send(validateUserData.error);
    }
    
    // Save User in the DB
    const user = new User(userPayload)
    const savedUser = await user.save()
    // @ TODO return not all data from user
    return res.status(200).send(savedUser);
  } catch (err) {
    return res.status(400).send(err);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  // Validate request data
  const validateUserData = userLoginValidationRequestPayload(req.body);
  if (validateUserData.error) {
    return res.status(400).send(validateUserData.error);
  }

  // Check if Email is already registered
  const registeredUser = await User.findOne({ email: req.body.email });
  if (!registeredUser) {
    return res.status(400).send({
      message: `User with ${req.body.email} email is not registered`,
    });
  }

  // Check if Password is correct
  const checkValidPassword = await bcrypt.compare(req.body.password, registeredUser.password);
  if (!checkValidPassword) {
    return res.status(400).send({
      message: `Password is incorrect`,
    });
  }

  // Create a JSON WEB TOKEN
  const token = getLoggedToken(registeredUser._id)
  
  return res.header('auth-token', token).status(200).send({
    name: registeredUser.name,
    email: registeredUser.email,
    type: registeredUser.type,
  });
})

module.exports = router;