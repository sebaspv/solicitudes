const router = require('express').Router()
const { getAll, getById, create, update, remove } = require('../controllers/requests.controller')
const { isAuthenticated } = require("../middleware/auth")

router.use(isAuthenticated)
router.get('/', getAll)
router.get('/:id', getById)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router
