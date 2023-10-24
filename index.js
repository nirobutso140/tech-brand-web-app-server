const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.iabkpld.mongodb.net/?retryWrites=true&w=majority`;


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

    const productsCollection = client.db('productsDB').collection('products');
    const cartDataCollection = client.db('productsDB').collection('cart')

    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    })

    app.post('/mycart', async (req, res) => {
      const myCart = req.body;
      console.log(myCart);
      const result = await cartDataCollection.insertOne(myCart);
      res.send(result)
    })

    // app.post('/update/:id', async (req, res) => {
    //   const myCart = req.body;
    //   console.log(myCart);
    // })



    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);

      // const result = await cursor.toArray();
    })


    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        brand: id,
      };
      const result = await productsCollection.find(query).toArray();
      res.send(result);

      // const result = await cursor.toArray();

    })

    app.get('/productDetails/:_id', async (req, res) => {
      const id = req.params._id;
      const query = {
          _id:  new ObjectId(id),
      };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
      
    })

    app.get('/update/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
          _id:  new ObjectId(id),
      };
      const result = await productsCollection.findOne(query);
      res.send(result);
      
    })

    app.put('/updated/:id', async (req, res) => {
      const id = req.params.id;
      const result = req.body
      console.log(id, result);
      const filter = {_id : new ObjectId(id)}

      const updatedProduct = {
        $set: {
          name : result.name,
          brand: result.brand,
          type: result.type,
          price: result.price,
          description: result.description,
          rating: result.rating,
          photo: result.photo
        }
      }
      
        const sendUpdatedProduct = await productsCollection.updateOne(filter, updatedProduct)
        res.send(sendUpdatedProduct)
    })


    // app.get("/products", async (req, res) => {
    //   const result = await productsCollection.find().toArray();
    //   res.send(result);
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!!!!!!!!!!!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})