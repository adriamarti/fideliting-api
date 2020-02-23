const Joi = require('@hapi/joi');

const userRegisterValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('customer', 'company').required() 
  }).required();

  return schema.validate(data);
};

const userRegisterValidationPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('customer', 'company').required(),
    status: Joi.string().valid('inactive').required(),
  }).required();

  return schema.validate(data);
};

const userConfirmRegisterValidationRequestPayload = (data) => {
  const schema = Joi.object({
    id: Joi.string().email().required(),
  }).required();

  return schema.validate(data);
};

const userConfirmRegisterValidationPayload = (data) => {
  const schema = Joi.object({
    status: Joi.string().valid('active').required(),
    stellarAccount: Joi.string().required(),
    stellarSeed: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

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
  userConfirmRegisterValidationRequestPayload,
  userConfirmRegisterValidationPayload,
  userLoginValidationRequestPayload
}