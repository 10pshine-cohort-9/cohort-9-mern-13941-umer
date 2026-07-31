const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('pino')();

const {
    createUser, findUserByEmail } = require('../models/userModel');


// -----------Signup Controller-------------

const signup = async (req, res, next) => {
    try {

        const { name, email, password } = req.body;


       if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message: 'All fields are required and must be text'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(name, email, hashedPassword);

        logger.info('New user registered successfully');

        return res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (err) {
        next(err);
    }
};


// ------------Login Controller---------------

const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        // Validation
       if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email || 
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required and must be text'
            });
        }

        // Finding user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        logger.info({ userId: user.id }, 'User logged in');

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token
        });

    } catch (err) {
        next(err);
    }
};


module.exports = { signup, login };