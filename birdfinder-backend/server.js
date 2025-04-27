/**
* BirdFinder Backend Server
* 
* This server handles requests for saving, fetching, and deleting bird sightings.
* It connects to a MongoDB database to store user-saved bird information.
* The server also manages CORS and body parsing for incoming requests.
*/

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Loads environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose schema for storing bird information
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

// Mongoose model for Bird collection
const Bird = mongoose.model('Bird', birdSchema);

/**
* Route to save a new bird to the database
* 
* @route POST /saveBird
* @body {Object} Bird data
* @returns {Object} Success message or error
*/
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

/**
* Route to fetch all saved birds from the database
* 
* @route GET /birds
* @returns {Array} List of birds or error
*/
app.get('/birds', async (req, res) => {
    try {
        const birds = await Bird.find();
        res.json(birds);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching birds' });
    }
});

/**
* Route to delete a bird by its ID
* 
* @route DELETE /birds/:id
* @param {String} id - Bird document ID
* @returns {Object} Success message or error
*/
app.delete('/birds/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Bird.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Bird not found' });
        }

        res.json({ message: 'Bird deleted successfully' });
    } catch (error) {
        console.error('Error deleting bird:', error);
        res.status(500).json({ message: 'Error deleting bird' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});