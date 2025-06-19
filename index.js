import express from 'express';
import cors from 'cors';
import client from './mongodb.js';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const membersDB = client.db('mukto-pathagar').collection('members'); 
    const booksDB = client.db('mukto-pathagar').collection('books');

    app.get('/All-books', async(req, res)=> {
      try{

         const cursor = booksDB.find().sort({ createdAt: -1 });
        const result = await cursor.toArray();
        res.send([result, result.length]) 
      }catch (error) {
    console.error(chalk.red("Error fetching members:", error));
    res.status(500).send({ error: "Internal Server Error" });
  }
    })

app.post('/All-books', async (req, res) => {
  try {
    const book = {
      ...req.body,
      createdAt: new Date()
    };

    console.log(book);
    const result = await booksDB.insertOne(book);
    res.send(result);
  } catch (error) {
    console.error(chalk.red("Error posting book:", error));
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete('/book/:id', async (req, res) => {
  const id = req.params.id; 
  const query = { _id: new ObjectId(id)}
  const result = await booksDB.deleteOne(query);
  res.send(result)

})



    app.get('/members', async(req, res)=> {
      try{

         const cursor = membersDB.find().sort({ createdAt: -1 });
        const result = await cursor.toArray();
        res.send(result) 
      }catch (error) {
    console.error(chalk.red("Error fetching members:", error));
    res.status(500).send({ error: "Internal Server Error" });
  }
    })

    app.get('/abc', (req, res) => {
      res.send("I am alive.")
    })




app.post('/members', async(req, res)=> {
  const member = {
      ...req.body,
      createdAt: new Date()
    };
  const result = await membersDB.insertOne(member);
  res.send(result);
})

app.delete('/member/:id', async (req, res) => {
  const id = req.params.id; 
  const query = { _id: new ObjectId(id)}
  const result = await membersDB.deleteOne(query);
  res.send(result)

})


    // Optional: check connection with a ping
    await client.db("admin").command({ ping: 1 });
    console.log(chalk.cyan("Pinged your deployment. You successfully connected to MongoDB!"));
  } catch (error) {
    console.error(chalk.red("Failed to connect to MongoDB:", error));
  }
}

run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("Hello ka ka kaaaaaaa");
});

app.listen(port, () => {
  console.log(chalk.yellow(`Server is running on port ${port}`));
});
