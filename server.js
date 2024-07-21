const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb+srv://manish:manish123456@cluster0.6zoez77.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

let onlineUsers = {};

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('register', async (data) => {
        const { name, email, mobile, avatar, description, password } = data;
        try {
            const newUser = new User({ name, email, mobile, avatar, description, password });
            const savedUser = await newUser.save();
            const token = jwt.sign({ id: savedUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
            socket.emit('registrationSuccess', { token, user: savedUser });
            onlineUsers[socket.id] = savedUser;
            io.emit('userSessions', Object.values(onlineUsers));
        } catch (error) {
            socket.emit('registrationError', error.message);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        delete onlineUsers[socket.id];
        io.emit('userSessions', Object.values(onlineUsers));
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
