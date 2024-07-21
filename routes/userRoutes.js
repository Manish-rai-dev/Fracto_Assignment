const express = require('express');
const { registerUser, getUserSessions } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.get('/sessions', verifyToken, getUserSessions);

module.exports = router;
