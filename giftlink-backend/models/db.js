// db.js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

// 返回所连接的database对象
async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });      

    try{
        // Connect to MongoDB, connect to database giftDB and store in variable dbInstance and return
        await client.connect();
        dbInstance = client.db("giftdb");
        return dbInstance;
    }catch(error){
        console.error("Fail to connect to MongoDB:", error);
        throw error;
    }

};

module.exports = connectToDatabase;
