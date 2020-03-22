const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const port = process.env.API_SERVER_PORT || 3000;
const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost/issuetracker';
// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
const url = process.env.DB_URL || 'mongodb+srv://patiltejas2578:User123@productinventory-nq0wd.mongodb.net/productDB?retryWrites=true';
// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';
let db;
let aboutMessage = 'Product Inventory';

// const productDB = [
//   // {
//   //   id: 1, category: 'Jeans', name: 'Zara', price: 250,
//   //   image: 'https://www.zara.com',
//   // },
//   // {
//   //   id: 2, category: 'Jackets', name: 'H&M', price: 500,
//   //   image: 'https://www.hm.com',
//   // },
// ];

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { product }) {
  // product.id = productDB.length + 1;
  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');

  // productDB.push(product);
  const result = await db.collection('products').insertOne(newProduct);

  // return product;
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

async function productList() {
  // return productDB;
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList,
  },
  Mutation: {
    setAboutMessage,
    productAdd,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
server.applyMiddleware({ app, path: '/graphql' });

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
      // console.log('API started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
