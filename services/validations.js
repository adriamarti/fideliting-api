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

const companyTransactionToClientValidationRequestPayload = (data) => {
  const schema = Joi.object({
    clientId: Joi.string().required(),
    amount: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const companyGetTransactionsValidationRequestPayload = (data) => {
  const schema = Joi.object({
    cursor: Joi.string(),
    limit: Joi.string(),
    order: Joi.string(),
  }).required();

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

const clientLoginValidationRequestPayload = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required();

  return schema.validate(data);
};

const clientTransactionToCompanyValidationRequestPayload = (data) => {
  const schema = Joi.object({
    companyId: Joi.string().required(),
    amount: Joi.string().required(),
  }).required();

  return schema.validate(data);
};


module.exports = {
  companyRegisterValidationRequestPayload,
  companyRegisterConfirmationValidationRequestPayload,
  companyLoginValidationRequestPayload,
  companyBuyFidelValidationRequestPayload,
  companyTransactionToClientValidationRequestPayload,
  companyGetTransactionsValidationRequestPayload,
  clientRegisterValidationRequestPayload,
  clientLoginValidationRequestPayload,
  clientTransactionToCompanyValidationRequestPayload,
}