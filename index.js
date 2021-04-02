const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 4000


app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER)


app.get('/', (req, res) => {
    res.send(` Hello Rahul Mohonto Welcome to port ${port}`)
})
