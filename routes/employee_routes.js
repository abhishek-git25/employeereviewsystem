const express = require('express');
const router = express.Router();
const passport = require('passport')



const employeeController  = require('../controller/employee_controller')
const homeController = require('../controller/home_controller')


router.post('/addEmployee' , employeeController.addEmployee);
router.get('/edit-employee/:id' , homeController.getEditEmployee)
router.post('/update-employee/:id' , homeController.updateEmployee)
router.get('/delete-employee/:id' , homeController.deleteEmployee)
router.get('/employee-review' , employeeController.employeeReview)
router.post('/post-review' , employeeController.addEmployeeReview)
router.get('/assign-review' , employeeController.assignReviewer)
router.post('/assign-employee-reviewer' , employeeController.assignEmployeeReviewers)
module.exports = router