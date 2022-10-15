const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.loginUserGet)
router.post('/', userController.loginUserPost)

router.get('/sign-up', userController.createUserGet)
router.post('/sign-up', userController.createUserPost)

router.get('/log-in', userController.loginUserGet)
router.post('/log-in', userController.loginUserPost)

router.get('/access', userController.givePermissionGet)
router.post('/access', userController.givePermissionPost)

module.exports = router
