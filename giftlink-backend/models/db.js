// db.js
// 导出 connectToDatabase，封装数据库连接操作

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;
console.log("url: " + url)

let dbInstance = null;
const dbName = "giftdb";

// 返回所连接的database对象
async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);
    try{
        // Connect to MongoDB, connect to database giftDB and store in variable dbInstance and return
        await client.connect();
        dbInstance = client.db(dbName);
        return dbInstance;
    }catch(error){
        console.error("Fail to connect to MongoDB:", error);
        throw error;
    }

};

module.exports = connectToDatabase;
