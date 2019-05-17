const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({ email: req.body.email });
    if (candidate) {
        // User found, check password
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            // Password matched, generate token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwtSecret, {expiresIn: 60 * 60});
            res.status(200).json({
                token: `Bearer ${token}`
            });
        } else {
            // Wrong password
            res.status(401).json({
                message: 'Wrong password'
            });
        }
    } else {
        // User not found, throw error
        res.status(404).json({
            message: 'Email not found'
        });
    }
};

module.exports.register = async function(req, res) {
    const candidate = await User.findOne({ email: req.body.email });
    if (candidate) {
        // User exists, returning error
        res.status(409).json({
            message: 'User with this Email already exists in database'
        });
    } else {
        // User doesn't exist, creating new user
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password.toString(), 10)
        });
        try {
            await user.save();
            res.status(201).json(user);
        } catch (err) {
            errorHandler(res, err);
        }
    }
};