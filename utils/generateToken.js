const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwtConfig');

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
};

module.exports = generateToken;
