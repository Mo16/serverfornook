const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 2000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
    .connect(
        "mongodb+srv://testuser:pass@cluster0.a1si9rk.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// User model
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        address: String,
        tokens: Number,
    })
);

// Route to add a user
app.post("/adduser", async (req, res) => {
    const { username, address, tokens } = req.body;
    if (!username || !address || !tokens) {
        return res.status(400).send("Username and address are required");
    }

    try {
        // Check if the address already exists and update the username if it does
        const updatedUser = await User.findOneAndUpdate(
            { address }, // find a document with this address
            { username: username.toLowerCase(), tokens }, // update the username
            { new: true, upsert: true } // options: return the updated document and create it if it doesn't exist
        );

        if (updatedUser) {
            res.status(201).send("User added or updated successfully");
        } else {
            res.status(404).send("User not found and not added");
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post("/checkuser", async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).send("Username is required");
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
