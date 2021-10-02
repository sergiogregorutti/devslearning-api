const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { sendEmailWithMailgun } = require("../helpers/email");
const user = require('../models/user');

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
 
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "E-mail is taken",
      });
    }
 
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
 
    const emailData = {
      from: "Devs Learning <noreply@devslearning.com>",
      to: email,
      subject: "ACCOUNT ACTIVATION LINK",
      text: `
                Please use the following link to activate your account
                http://localhost:3000/auth/activate/${token}
                his email may contain sensitive information
                http://localhost:3000
            `,
      html: `
          <h1>Please use the following link to activate your account</h1>
          <p>http://localhost:3000/auth/activate/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>http://localhost:3000</p>
      `,
    };
 
    sendEmailWithMailgun(req, res, emailData);
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
      if (err) {
        console.log('Verify activation error', err);
        res.status(401).json({
          error: 'Expired link. Sign up again.'
        });
      }

      const { name, email, password } = jwt.decode(token);
      const user = new User({name, email, password});

      user.save((err, user) => {
        if (err) {
          console.log('Save user error', err);
          res.status(401).json({
            error: 'Error saving user in database. Try sign up again.'
          });
        }

        return res.json({
          message: 'Signup success. Please signin.'
        });
      })
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again.'
    });
  }
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  // Check if user exists:
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please, sign up.'
      });
    }

    // Authenticate user:
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.'
      });
    }

    // Generate token and sent it to client:
    const token = jwt.sign({'_id': user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role }
    });
  });
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
  algorithms: ['HS256']
});

exports.adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
      if (err || !user) {
          return res.status(400).json({
              error: 'User not found'
          });
      }

      if (user.role !== 'admin') {
          return res.status(400).json({
              error: 'Admin resource. Access denied.'
          });
      }

      req.profile = user;
      next();
  });
};
