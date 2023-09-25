const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.sendStatus(403);
        }
        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
        if(!foundUser) {
            return res.sendStatus(403);
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY,
            (err, decoded) => {
                if(err || decoded.username !== foundUser.username) {
                    return res.sendStatus(403);
                }
                const roles = Object.values(foundUser.roles).filter(Boolean);
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            username: foundUser.username,
                            roles: roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET_KEY,
                    { expiresIn: '5m'}
                );
                res.status(200).json({ roles: roles, accessToken: accessToken});
            }
        )
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken };