const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-swap-platform';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Connected to database: ${MONGODB_URI}`);
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// Import User model
const User = require('../models/user');

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        message: "Server is running and connected to MongoDB!",
        timestamp: new Date().toISOString(),
        status: "success"
    });
});

// POST endpoint to create user profile
app.post('/create-profile', async (req, res) => {
    try {
        const { name, location, profilePhoto, skillsOffered, skillsWanted, availability, makePublic } = req.body;

        // Validate required fields
        if (!name || !location || !skillsOffered || !skillsWanted || !availability) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create new user profile
        const newUser = new User({
            name,
            location,
            profilePhoto: profilePhoto || '',
            skillsOffered,
            skillsWanted,
            availability,
            makePublic: makePublic || false,
            createdAt: new Date()
        });

        // Save to MongoDB
        const savedUser = await newUser.save();

        console.log('📝 New profile created:', savedUser._id);

        res.status(201).json({
            success: true,
            message: 'Profile created successfully!',
            data: savedUser
        });

    } catch (error) {
        console.error('❌ Error creating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create profile',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
