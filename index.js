const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://testuser:pass@cluster0.a1si9rk.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    address: String,
}));

// Route to add a user
app.post('/adduser', async (req, res) => {
    const { username, address } = req.body;
    if (!username || !address) {
        return res.status(400).send('Username and address are required');
    }

    try {
        const newUser = new User({ username: username.toLowerCase(), address });
        await newUser.save();
        res.status(201).send('User added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/checkuser', async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
