const express = require('express')
require('dotenv').config()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => 
    res.send('Hello World!'))

app.post('/email', (req, res) => {
    const { email = '', name = '', message = '' } = req.body
    res.send(`Post Test ${email} ${name} ${message}`)
})
    

app.listen(port, () => 
    console.log(`Example app listening on port ${process.env.PORT}!`))