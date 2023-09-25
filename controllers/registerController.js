const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const handleRegister = async (req, res) => {
    if (!req?.body?.username || !req?.body?.password) {
        return res.status(400).json({ message: 'Username or password is required' });
    }
    const { username, password } = req.body;
    try {
        const foundUser = await User.findOne({ username: username });
        if (foundUser) {
            return res.status(409).json({ message: 'Duplicate username' });
        }
        const passwordHashed = await bcrypt.hash(password, 10);
        const result = await User.create({
            username: username,
            password: passwordHashed
        });
        if (!result) {
            return res.sendStatus(500);
        }
        res.status(200).json({ message: `User ${username} created successfully` });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

module.exports = { handleRegister };