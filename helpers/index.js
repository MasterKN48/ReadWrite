const { check, validationResult } = require("express-validator");
const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@readwrite.io" };
const dotenv = require("dotenv");
dotenv.config();
exports.sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.PASS,
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

exports.createPostValidator = (req, res, next) => {
  check("title", "Write a title").not().isEmpty();
  check("title", "Should be of 4 to 200 length").isLength({ min: 4, max: 200 });
  check("body", "Write a body").not().isEmpty();
  check("body", "Should be of 4 to 3000 length").isLength({
    min: 4,
    max: 30000,
  });
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

exports.signupValidator = (req, res, next) => {
  // check name
  check("name", "Name is required", req.body.name).not().isEmpty();
  check("email", "Email must be btw  3 to 32 chars", req.body.email)
    .isEmail()
    .withMessage("Email must contain @")
    .isLength({ min: 5, max: 200 });
  check("password", "Password is required", req.body).not().isEmpty();
  check("password", req.body.password)
    .isLength({ min: 6 })
    .withMessage("Password must have atleast 6 chars")
    .matches(/\d/);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};
exports.passwordResetValidator = (req, res, next) => {
  // check for password
  req.check("newPassword", "Password is required").notEmpty();
  req
    .check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long")
    .matches(/\d/)
    .withMessage("must contain a number")
    .withMessage("Password must contain a number");

  // check for errors
  const errors = req.validationErrors();
  // if error show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  // proceed to next middleware or ...
  next();
};
