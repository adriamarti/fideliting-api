const Joi = require('@hapi/joi');

const userRegisterValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('customer', 'business').required() 
  }).required();

  return schema.validate(data);
};

const userRegisterValidationPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('customer', 'business').required(),
    address: Joi.string().required(),
  }).required();

  return schema.validate(data);
};


// User Login Validation
const userLoginValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

module.exports = {
  userRegisterValidationRequestPayload,
  userRegisterValidationPayload,
  userLoginValidationRequestPayload
}