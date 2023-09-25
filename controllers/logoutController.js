const User = require('../models/User');

const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.sendStatus(204);
        }
        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({ refreshToken: refreshToken });
        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.sendStatus(204);
        }
        foundUser.refreshToken = '';
        await foundUser.save();
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({message: `${foundUser.username} has logged out`});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

module.exports = { handleLogout };