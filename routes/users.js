const router = require('express').Router();
const usersController = require('../controllers/users.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

router.get('/', usersController.getUsers);
router.get('/:userId', usersController.getUser);
router.post('/', usersController.createUser);
router.put('/:userId', usersController.modifyUser);
router.delete('/:userId', usersController.removeUser);

module.exports = router;