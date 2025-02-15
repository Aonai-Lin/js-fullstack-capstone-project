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

        // Save user details in database，preserve  the ref
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

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info(`User registered successfully: ${email}`);
        res.json({authtoken, email});


    }catch(e){
        return res.status(500).send(e.message);
    }

});

export default router;