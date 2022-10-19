const express = require('express')
const router = express.Router()
const messageController = require('../controllers/messageController')

router.get('/create', messageController.createMessageGet)
router.post('/create', messageController.createMessagePost)

router.get('/:id/delete', messageController.deleteMessageGet)
router.post('/:id/delete', messageController.deleteMessagePost)

module.exports = router
