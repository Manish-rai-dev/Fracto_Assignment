const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { name, email, mobile, avatar, description, password } = req.body;
    try {
        const newUser = new User({ name, email, mobile, avatar, description, password });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserSessions = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    getUserSessions,
};
