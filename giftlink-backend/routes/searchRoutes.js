/* eslint-env es8 */
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
// 从req请求获取搜索参数，去数据库查询，然后response返回
router.get('/', async (req, res, next) => {
    try {
        // Connect to MongoDB using connectToDatabase database and store the connection in `db`
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is not empty
        // 直接用{ $regex: req.query.name, $options: "i" }作为name去数据库查询
        if (req.query.name && req.query.name.trim()!="") {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }
        // log query to see the form
        console.log(query);

        // Fetch filtered gifts using the find(query) method. Use await and store the result in the `gifts` constant
        // find函数的参数是一个字典对象（键值对）
        const gifts = await collection.find(query).toArray();
        console.log("founded results:", gifts);

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
