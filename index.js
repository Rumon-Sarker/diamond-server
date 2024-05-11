const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//Middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@expressdb.hgdaj4q.mongodb.net/?retryWrites=true&w=majority&appName=ExpressDB`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // Db all collactions 
        const allItemsCollaction = client.db("diamond-db").collection("allItems");
        const cartCollaction = client.db("diamond-db").collection("cart");
        const blogsCollaction = client.db("diamond-db").collection("blogs");

        // ============ Itmes All Data =============

        // all data get api 
        app.get("/allItems", async (req, res) => {
            const result = await allItemsCollaction.find().toArray();
            res.send(result);
        });

        // items details api 
        app.get("/allItems/:id", async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) };
            const result = await allItemsCollaction.findOne(qurey);
            res.send(result);
        });

        // ============ Cart Data =============


        // user email get data api
        app.get("/cart/:email", async (req, res) => {
            const email = req.params?.email;
            const qurey = { email: email };
            const result = await cartCollaction.find(qurey).toArray();
            res.send(result);
        });
        // added cart data api
        app.post("/cart", async (req, res) => {
            const items = req.body;
            const result = await cartCollaction.insertOne(items);
            res.send(result);
        });
        app.delete("/cart/:id", async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) };
            const result = await cartCollaction.deleteOne(qurey);
            res.send(result);
        });

        // ============ Blog Data =============
        // all blog data get 
        app.get("/blogs", async (req, res) => {
            const result = await blogsCollaction.find().toArray();
            res.send(result);
        });

        //  single blog data find 
        app.get("/blogs/:id", async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) };
            const result = await blogsCollaction.findOne(qurey);
            res.send(result);
        });














        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send("Diamond Server is Running")
})


app.listen(port, () => {
    console.log(`Diamond Server is Running...... http://localhost:${port}`)
})