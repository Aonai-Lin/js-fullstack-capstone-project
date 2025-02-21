/*jshint esversion: 8 */

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
            // throw new Error("User already exist, please login");
            console.log('existing user!');
            return res.status(400).json({ error: "User already exists, please log in" });
        }
    
        // Create JWT authentication
        const salt = await bcryptjs.genSalt(10);
        const hash_password = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        const userName = req.body.firstName;

        // 存储用户，Save user details in database，preserve  the ref
        // 密码应存储为密文
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash_password,
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
        logger.error(`Registration failed: ${e.message}`);
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
            let password_match = await bcryptjs.compare(req.body.password, theUser.password);
            if(!password_match){
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

// 更新用户信息，并在成功更新后生成一个新的 JWT 令牌
router.put('/update', async (req, res) => {

    // 检查请求对象 req 是否通过了之前定义的所有验证中间件（middleware），或可在处理函数前添加验证规则
    const errors = validationResult(req);

    // if there is a validate error
    if(!errors.isEmpty()){
        logger.error('Validation error in update request', errors.array());
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const email = req.headers.email;    // 
        if(!email){
            logger.error('Email not found in the request headers');
            return res.status(400).json({error: "Email not found in the request headers"});
        }

        // connect to MongoDB and target collection
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // find user credential 
        const existingUser = await collection.findOne({email});
        if (!existingUser){
            logger.error('User not found');
            return res.status(400).json({error: 'User not found'});
        }

        // update the user attribute in memory, existingUser is an object here
        existingUser.firstName = req.body.name;
        existingUser.updateAt = new Date();

        // update user credential in Database
        const updatedUser = await collection.findOneAndUpdate(  // 更新单个文档的首选，可确保文档存在、获取更新后的文档、原子操作、条件更新和错误处理
            { email },
            { $set: existingUser },
            { returnDocument: 'after'}
        );

        // create JWT authentication with user._id as payload using secret key from .env file
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');
        res.json({ authtoken });

    }catch(e){
        logger.error(e);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

// res.json() 将 JavaScript 对象或数组序列化为 JSON 字符串，
// 并将其作为 HTTP 响应的正文（body）发送给客户端。
// 同时，它还会自动设置 HTTP 响应的 Content-Type 头部为 application/json，
// 以告知客户端响应的内容类型是 JSON。