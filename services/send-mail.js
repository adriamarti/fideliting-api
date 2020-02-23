const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const buildMessage = (email, name, token) => {
  console.log(token);
  const link = `https://www.fideliting.com/registration/${token}`;

  return {
    to: email,
    from: 'adria.marti.blasco@gmail.com',
    templateId: 'd-eb90e92f2c3b41b7be67907b47027e4c',
    dynamic_template_data: {
      name,
      link,
    },
  }
};

const sendConfirmRegistrationMail = async (email, name, token) => {
  const message = buildMessage(email, name, token);

  try {
    const sendEmail = await sgMail.send(message);

    return sendEmail;
  } catch(e) {
    throw(e);
  }
};

module.exports = {
  sendConfirmRegistrationMail,
}