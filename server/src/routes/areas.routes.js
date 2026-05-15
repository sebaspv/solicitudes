const router = require('express').Router()
const { getAll, getById, create, update, remove } = require('../controllers/areas.controller')
const { isAuthenticated } = require('../middleware/auth')
const { checkRole } = require('../middleware/authorize')

const checkAdmin = checkRole('admin')

router.use(isAuthenticated)
router.get('/', getAll)
router.get('/:id', getById)
router.use(checkAdmin)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router
