const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const adminRouter = require('./routes/adminRoutes');
const authRouter = require('./routes/authRoutes');
const publicRouter = require('./routes/publicRoutes');
const bookingRouter = require('./routes/bookingRoutes');

dotenv.config();

const app = express();
app.use(cors({
    // origin: '*',
    origin: 'http://localhost:3000',
    credentials: true,    
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser()); 

app.use('/auth', authRouter);
app.use('/users', authRouter);
app.use('/admin', adminRouter);
app.use('/public', publicRouter);
app.use('/booking', bookingRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));