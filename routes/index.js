const express =  require('express');
const router =  express.Router();

router.use(express.json());

const homeController = require('../controller/home_controller')


router.get('/' , homeController.home)
router.use('/' , require('./user_routes'))
router.use('/' , require('./employee_routes'))
router.use('/' , require('./pendingreview_routes'))

module.exports = router;