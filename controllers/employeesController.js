const Employee = require('../models/Employee');

const getEmployee = async (req, res) => {
    try {
        if(!req?.params?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const employee = await Employee.findOne({ _id: req.params.id}).exec();
        if(!employee) {
            return res.sendStatus(204);
        }
        res.status(200).json({data: employee});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().exec();
        if(!employees) {
            return res.sendStatus(204);
        }
        res.status(200).json({data: employees});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const createEmployee = async (req, res) => {
    try {
        if(!req?.body?.firstname || !req?.body?.lastname) {
            return res.status(400).json({message: 'First name and last name are required'});
        }
        const {firstname, lastname} = req.body;
        const result = await Employee.create({firstname: firstname, lastname: lastname});
        if(!result) {
            return res.sendStatus(500);
        }
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const updateEmployee = async (req, res) => {
    try {
        if(!req?.body?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const employee = await Employee.findOne({ _id: req.body.id}).exec();
        if(!employee) {
            return res.sendStatus(204);
        }
        if(req.body.firstname) {
            employee.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            employee.lastname = req.body.lastname;
        }
        const result = await employee.save();
        if(!result) {
            res.sendStatus(500);    
        }
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

const deleteEmployee = async (req, res) => {
    try {
        if(!req?.params?.id) {
            return res.status(400).json({message: 'ID is required'});
        }
        const employee = await Employee.findOne({ _id: req.params.id}).exec();
        if(!employee) {
            return res.sendStatus(204);
        }
        const result = await employee.deleteOne();
        if(!result) {
            return res.sendStatus(500);
        }
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

module.exports = {
    getEmployee,
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
}
