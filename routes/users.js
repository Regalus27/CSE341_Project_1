const router = require('express').Router();
const usersController = require('../controllers/users.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUser);
router.post('/', isAuthenticated, usersController.createUser);
router.put('/:userId', isAuthenticated, usersController.modifyUser);
router.delete('/:userId', isAuthenticated, usersController.removeUser);

module.exports = router;