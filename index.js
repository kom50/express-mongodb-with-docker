import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;

// const url = 'mongodb://om:1234om@localhost:27017';
const url = 'mongodb://mongodb:27017';
const dbName = 'test'

// Create a new MongoClient
const client = new MongoClient(url, {});

try {
  // Connect to MongoDB
  await client.connect();
  console.log('Connected to MongoDB');

} catch (err) {
  console.log("🚀 Error during connect", err)
}

// Close the MongoDB connection when the app is terminated
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  // Handle the error or log it
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/posts', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('posts');

  try {
    const posts = await collection.find({}).toArray();
    console.log("🚀 ~ file: index.js:39 ~ app.get ~ posts:", posts)
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/posts', async (req, res) => {
  const post = req.body;

  console.log('Received post data:', post);

  const db = client.db(dbName);
  const collection = db.collection('posts');
  try {
    const result = await collection.insertOne(post);
    console.log("🚀 ~ file: index.js:55 ~ app.post ~ result:", result)
    console.log(`Inserted post id : ${result.insertedId}`);
    res.json(`Inserted post id : ${result.insertedId}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }

});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
