require('dotenv').config()
const express = require('express')
var cors = require('cors')
const mailgun = require("mailgun-js")
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3001

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors())
    .options('*', cors())

app.get('/', (req, res) => 
    res.send('Hello World!'))

app.post('/email', (req, res) => {
    // Request from react
    const { email, name, message } = req.body
    // Mailgun
    const mg = mailgun({apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN});
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
        } else {
            res.send(`Poruka poslata`)
        }
    });
})
    
app.listen(port, () => 
    console.log(`Example app listening on port ${process.env.PORT}!`))