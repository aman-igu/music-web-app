const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// CORS configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/ai', aiRoutes);

module.exports = app;