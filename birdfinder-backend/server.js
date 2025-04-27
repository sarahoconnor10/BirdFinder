const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const birdSchema = new mongoose.Schema({
    name: String,
    scientificName: String,
    genus: String,
    habitat: String,
    rarity: String,
    funFact: String,
    shortDescription: String,
    date: { type: Date, default: Date.now },
    image: String
});

const Bird = mongoose.model('Bird', birdSchema);

app.post('/saveBird', async (req, res) => {
    try {
        const bird = new Bird(req.body);
        await bird.save();
        res.status(201).json({ message: 'Bird saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving bird' });
    }
});

app.get('/birds', async (req, res) => {
    try {
        const birds = await Bird.find();
        res.json(birds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching birds' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});