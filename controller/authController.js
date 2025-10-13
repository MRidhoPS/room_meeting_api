const bcrypt = require('bcryptjs');
const { findUserByEmail, signupQuery, signupAdminQuery, loginQuery } = require('../model/authModel');
const { generateToken } = require('../lib/util');

async function signup(req, res) {
    const { fullName, email, password } = req.body;

    try {

        if (!password || !email || !fullName) {
            return res.status(400).json({ message: "All field are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }


        const existingEmail = await findUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({ message: 'Email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await signupQuery({
            name: fullName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Registrasi berhasil', user_id: userId });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}

async function signupAdmin(req, res) {
    const { fullName, email, password } = req.body;

    try {

        if (!password || !email || !fullName) {
            return res.status(400).json({ message: "All field are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }


        const existingEmail = await findUserByEmail(email);

        if (existingEmail) {
            return res.status(409).json({ message: 'Email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await signupAdminQuery({
            name: fullName,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ status: 201, message: 'Registrasi berhasil' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        if (!password || !email) {
            return res.status(400).json({ message: "All field are required" })
        }

        const result = await loginQuery({ email });

        if (!result) {
            return res.status(404).json({ message: 'Invalid Credential' });
        }

        const isMatch = await bcrypt.compare(password, result.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credential' });
        }

        const tokenRes = generateToken(result.id, result.name, result.email, res, result.role);

        res.status(200).json({
            status: 200,
            message: 'Login berhasil',
            token: tokenRes,
        });

        console.log("Login: ", tokenRes);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}

module.exports = {
    signup,
    signupAdmin,
    login,
};