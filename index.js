const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 4200


app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER)


app.get('/', (req, res) => {
    res.send(` Hello Rahul Mohonto Welcome to port ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adxso.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("full-stack-assignment-database").collection("products");
    console.log("database connected successfully")

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding products', newProduct);
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })

    })

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

});



app.listen(port, () => {
    console.log(`welcome rahul Mohonto at port http://localhost:${port}`)
})