const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express()
const port = process.env.PORT || 4000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlec2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        // console.log('Connected to db');

        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");


        //GET API
        app.get('/services', async (req, res) => {
            const query = {};
            const options = {};
            const cursor = servicesCollection.find(query, options);

            const services = await cursor.toArray();

            res.send(services);

        })


        //GET API(SINGLE SERVICE)
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await servicesCollection.findOne(query);
            res.json(service);
        })


        //POST API
        app.post('/services', async (req, res) => {

            const service = req.body;

            // console.log('got !!!', service);

            const result = await servicesCollection.insertOne(service);

            // console.log(result);

            res.json(result)
        })


        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);

            res.json(result);
        })



    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World---- genius!')
})



app.listen(port, () => {
    console.log(`Running Genius Server at http://localhost:${port}`)
})