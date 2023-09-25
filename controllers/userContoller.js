const User = require('../models/User');

const getUser = async (req, res) => {
    try {
        if(!req?.params?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const user = await User.findOne({ _id: req.params.id}).exec();
        if(!user) {
            return res.sendStatus(204);
        }
        return res.status(200).json({data: user});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        if (!users) {
            return res.sendStatus(204);
        }
        res.status(200).json({ data: users });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const updateUser = async (req, res) => {
    try {
        if(!req?.body?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const user = await User.findOne({ _id: req.body.id}).exec();
        if(!user) {
            return res.sendStatus(204);
        }
        if(user.roles.Admin) {
            return res.sendStatus(409);
        }
        if(req.body.username) {
            user.username = req.body.username;
        }
        if(req.body.password) {
            user.password = req.body.password;
        }
        const result = await user.save();
        if(!result) {
            return res.sendStatus(500);
        }
        res.status(200).json({message: 'User has been updated'});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

const deleteUser = async (req, res) => {
    try {
        if(!req?.params?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const user = await User.findOne({ _id: req.params.id}).exec();
        if(!user) {
            return res.sendStatus(204);
        } 
        const result = await user.deleteOne();
        if(!result) {
            return res.sendStatus(500);
        }
        res.status(200).json({message: 'Successfully deleted'});
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
}