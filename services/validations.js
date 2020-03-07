const Joi = require('@hapi/joi');

const companyRegisterValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const companyRegisterConfirmationValidationRequestPayload = (data) => {
  const schema = Joi.object({
    location: Joi.string().required(),
    nif: Joi.string().required(),
    phone: Joi.string().required(),
    sector: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const companyLoginValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const companyBuyFidelValidationRequestPayload = (data) => {
  const schema = Joi.object({
    amount: Joi.string().required(),
  })

  return schema.validate(data);
}

const clientRegisterValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const clientRegisterConfirmationValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().valid('customer', 'company').required(),
    status: Joi.string().valid('inactive').required(),
  }).required();

  return schema.validate(data);
};

const clientLoginValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();

  return schema.validate(data);
};


module.exports = {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyLoginValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  clientRegisterValidationRequestPayload,
  clientRegisterConfirmationValidationRequestPayload,
  clientLoginValidationRequestPayload,
}