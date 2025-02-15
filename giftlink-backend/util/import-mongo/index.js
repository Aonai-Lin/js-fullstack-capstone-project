// env需要与index.js同级而且等号两边不能有空格
// 把初始数据插入数据库
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;
console.log('MongoDB URL:', url); // 打印URL以确认是否正确加载
let filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    const client = new MongoClient(url);

    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log("Connected successfully to server");

        // database will be created if it does not exist
        const db = client.db(dbName);

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = collection.find({});
        let documents = await cursor.toArray();

        if(documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log("Gifts already exists in DB")
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

loadData();

module.exports = {
    loadData,
  };
