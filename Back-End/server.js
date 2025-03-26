// Import express module
const express = require('express');

// Create an instance of express
const app = express();

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

//Connect mongoDB
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user:uLHMhGtuSJxapaGX@advertisementlk.e9yjw2u.mongodb.net/?retryWrites=true&w=majority&appName=AdvertisementLk";
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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
