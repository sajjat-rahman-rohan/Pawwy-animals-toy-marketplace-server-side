const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// app.use(
//   cors({
//     origin: "https://pawwy-animals-toy-marketplace.web.app",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   })
// );

// middleware
app.use(cors());
app.use(express.json());

// Mongodb CRUD operation
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwuohob.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    const addedNewAndAllToy = client.db("addedAllToy").collection("addedtoy");

    // Total Toys operation
    app.get("/totalToys", async (req, res) => {
      const result = await addedNewAndAllToy.estimatedDocumentCount();
      res.send({ totalToys: result });
    });

    // My Toys operation
    app.get("/getMyToys", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await addedNewAndAllToy.find(query).toArray();
      res.send(result);
    });

    // pagination per page operation
    app.get("/addedtoy", async (req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const skip = page * limit;
      // const cursor = addedNewAndAllToy.find();
      const result = await addedNewAndAllToy
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();
      res.send(result);
    });

    // View details toy operation
    app.get("/addedtoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedNewAndAllToy.findOne(query);
      res.send(result);
    });

    // sub category toy operation
    app.get("/subcategory", async (req, res) => {
      console.log(req.query.sub_category);
      let query = {};
      if (req.query?.sub_category) {
        query = { sub_category: req.query.sub_category };
      }
      const result = await addedNewAndAllToy.find(query).toArray();
      res.send(result);
    });

    // Post Toy operation
    app.post("/addedtoy", async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await addedNewAndAllToy.insertOne(newToy);
      res.send(result);
    });

    // Update only this user toy operation
    app.put("/addedtoy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;

      const toy = {
        $set: {
          available_quantity: updatedToy.available_quantity,
          price: updatedToy.price,
          rating: updatedToy.rating,
          seller_name: updatedToy.seller_name,
          email: updatedToy.email,
          detail_description: updatedToy.detail_description,
        },
      };

      const result = await addedNewAndAllToy.updateOne(filter, toy, options);
      res.send(result);
    });

    // Detele only this user toy operation
    app.delete("/addedtoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addedNewAndAllToy.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pawwy Animal Toy server is running");
});

app.get("/hello", (req, res) => {
  res.send("Pawwy Animal Toy hello server is running");
});

app.listen(port, () => {
  console.log(`Pawwy Animal Toy Server is running on port: ${port}`);
});
