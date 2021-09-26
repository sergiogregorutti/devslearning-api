exports.sendEmailWithMailgun = (req, res, emailData) => {
  const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

  return mg.messages.create('mail.devslearning.com', emailData)
  .then(msg => {
    console.log(msg);
    return res.json({
      message: `Email has been sent to your email. Follow the instruction to activate your account`,
    });
  })
  .catch(err => console.log(err));
};
