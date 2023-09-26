const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    if (!req?.body?.username || !req?.body?.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const { username, password } = req.body;
        const foundUser = await User.findOne({ username: username });
        if (!foundUser) {
            return res.status(401).json({ message: 'Username is invalid' });
        }
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({ message: 'Password is invalid' });
        } else {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        roles: roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: '5m' }
            );
            const refreshToken = jwt.sign(
                { username: foundUser.username },
                process.env.REFRESH_TOKEN_SECRET_KEY,
                { expiresIn: '1d' }
            );
            foundUser.refreshToken = refreshToken;
            await foundUser.save();
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).json({ roles: roles, accessToken: accessToken });
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

module.exports = { handleLogin };