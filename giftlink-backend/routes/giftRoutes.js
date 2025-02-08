// 从models/db/js引入数据库连接函数
const connectToDatabase = require("../models/db");

router.get('/', async (req, res) => {
    try {
        //Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // use the collection() method to retrieve the gift collection
        const connection = db.collection('gifts');

        // Fetch all gifts using the collection.find method. Chain with toArray method to convert to JSON array
        const gifts = await connection.find({}).toArray();

        // return the gifts using the res.json method
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

router.get('/:id', async (req, res) => {
    try {
        // Connect to MongoDB and store connection to db constant
        const db = await connectToDatabase();

        // use the collection() method to retrieve the gift collection
        const connection = db.connection('gifts');

        const id = req.params.id;

        // Find a specific gift by ID using the collection.fineOne method and store in constant called gift
        const gift = await connection.findOne({id:id});

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});



// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
