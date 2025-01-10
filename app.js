const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');

const app = express();

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.database.dbConnectionString).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


// Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/supervisor', supervisorRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API event management is working fine v1.0' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: 'This route does not exist.' });
});

app.listen(config.http.port, () => {
    console.log(`Server started on http://localhost:${config.http.port}`);
});
