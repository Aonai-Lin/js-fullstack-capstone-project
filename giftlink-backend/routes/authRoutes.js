// Import necessary packages
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');


const logger = pino(); // Create a Pino logger instance

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;  // Create JWT secret

// handle the register request
router.post('/register', async (req, res) => {
    try{
        const db = await connectToDatabase();   // connect to database
        const collection = db.collection('users');  // retrive the target collection
        const existingEmail = await collection.findOne({email: req.body.email});  // user info contain in req.body
        // error: user existed
        if (existingEmail){
            throw new Error("User already exist, please login");
        }
    
        // Create JWT authentication
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        const userName = req.body.firstName;

        // 存储用户，Save user details in database，preserve  the ref
        // 密码应存储为密文
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
            
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);    // token由Header， Payload，Signature组成
        logger.info(`User registered successfully: ${email}`);
        res.json({authtoken, email, userName});

    }catch(e){
        // send返回的是纯文本格式，在前端需要用response.text()解析，要想用response.json()解析需要用json格式返回
        // return res.status(500).send(e.message);
        return res.status(500).json({e: e.message});

    }

});

router.post('/login', async (req, res) => {

    try{
        const db = await connectToDatabase();   // Connect to `giftsdb` in MongoDB
        const collection = db.collection('users'); // retrive the target collection
        const theUser = await collection.findOne({email: req.body.email});  // check user credentials
        
        if(theUser){
            // check whether the password matchs
            let result = await bcryptjs.compare(req.body.password, theUser.password);
            if(!result){
                logger.error('Password do not match!');
                return res.status(404).json({error: 'wrong password'});
            }
    
            // Fetch user details in database
            const userName = theUser.firstName;
            const userEmail = theUser.email;
    
            // Create JWT authentication if passwords match with user._id as payload
            const payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
    
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully!');
            return res.status(200).json({authtoken, userName, userEmail});
        }else{
            throw new Error('User does not exist, please register first!');
        }
    }catch(e){
        logger.error(e);
        return res.status(500).json({error: 'Internal server error', details: e.message});
    }
});

export default router;

// res.json() 将 JavaScript 对象或数组序列化为 JSON 字符串，
// 并将其作为 HTTP 响应的正文（body）发送给客户端。
// 同时，它还会自动设置 HTTP 响应的 Content-Type 头部为 application/json，
// 以告知客户端响应的内容类型是 JSON。