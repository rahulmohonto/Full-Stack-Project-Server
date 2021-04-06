const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require("firebase-admin");
require('dotenv').config();
const port = process.env.PORT || 4200


app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER)




var serviceAccount = require("./configs/full-stack-client-assignment-firebase-adminsdk-u7o2a-830507d9b4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://full-stack-client-assignment.firebaseio.com"
});


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


    app.delete('/deleteProduct/:id', (req, res) => {
        // const id = ObjectID(req.params.id);
        console.log('delete this product', id)
        // productCollection.findOneAndDelete({ _id: req.params.id })
        //     .then(result => {
        //         res.send(result.deletedCount > 0)
        //         console.log(result)
        //     })
        //     .catch(err => console.error(`Failed to find and delete document: ${err}`))
        productCollection.deleteOne({ _id: ObjectID(req.params.id) })

            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

});


const uriOrder = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adxso.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const clientOrder = new MongoClient(uriOrder, { useNewUrlParser: true, useUnifiedTopology: true });
clientOrder.connect(err => {
    const orderCollection = client.db("full-stack-assignment-order-database").collection("orders");


    app.post('/orders', (req, res) => {
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        console.log(newOrder)
    })

    app.get('/showOrders', (req, res) => {
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            console.log({ idToken })
            admin
                .auth()
                .verifyIdToken(idToken)
                .then((decodedToken) => {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    if (tokenEmail == queryEmail) {
                        orderCollection.find({ email: queryEmail })
                            .toArray((err, documents) => {
                                res.status(200).send(documents)
                                console.log(err)
                            })
                    }
                    // else {
                    //     res.status(401).send('Un-authorized Access')
                    // }
                    console.log({ tokenEmail })
                })
                .catch((error) => {
                    console.log(error)
                    res.status(401).send('Un-authorized Access')
                });
        }
        else {
            res.status(401).send('Un-authorized Access')
        }

    })

});



app.listen(port, () => {
    console.log(`welcome rahul Mohonto at port http://localhost:${port}`)
})