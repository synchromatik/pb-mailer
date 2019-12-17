require('dotenv').config()
const express = require('express')
var cors = require('cors')
const mailgun = require("mailgun-js")
const bodyParser = require('body-parser')
const { check, validationResult, body } = require('express-validator');

const app = express()
const port = process.env.PORT || 3001

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors())
  .options('*', cors())

app.get('/', (req, res) =>
  res.send('Hello World!'))

app.post('/email', [
  // email
  body('email')
    .isEmail()
    .normalizeEmail().withMessage('invalid-email'),
  // name at least 5
  check('name').isLength({ min: 3 }).withMessage('name-too-short'),
  // message
  body('message')
    .not()
    .isEmpty().withMessage('message-empty')
    .isLength({ min: 15}).withMessage('message-short')
    .isLength({ max: 1000 }).withMessage('message-long'),
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // Request from react
  const { email, name, message } = req.body
  // Mailgun
  const mg = mailgun({ apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN });
  // Pack it
  const data = {
    from: email,
    to: process.env.TO_EMAIL,
    subject: `Poruka sa sajta pickled-brain.com od ${name}`,
    text: message
  };
  // Send it 
  mg.messages().send(data, function (error, body) {
    if (error) {
      res.send(body)
      console.log(body)
    } else {
      res.send({ status: 'success' });
      console.log(`new message from: ${name} email:${email} message: ${message}`)
    }
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`))