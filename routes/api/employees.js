const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController');
const ROLE_LIST = require('../../config/ROLE_LIST');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLE_LIST.Admin), employeesController.createEmployee)
    .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor), employeesController.updateEmployee);

router.route('/:id')
    .get(employeesController.getEmployee)
    .delete(verifyRoles(ROLE_LIST.Admin), employeesController.deleteEmployee);

module.exports = router;