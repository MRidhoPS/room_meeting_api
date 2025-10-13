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
const allowedOrigins = [
    'http://localhost:3000',   // web frontend
    'http://10.152.105.5:7000',    // Android emulator akses backend
    'http://192.168.18.13:7000'  // device fisik (ganti dengan IP laptop)
];

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser()); 

app.use('/roomapp/auth', authRouter);
app.use('/roomapp/users', authRouter);
app.use('/roomapp/admin', adminRouter);
app.use('/roomapp/public', publicRouter);
app.use('/roomapp/booking', bookingRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));