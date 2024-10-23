const router = require('express').Router();
const validation = require('../middleware/validate.js');
const actionsController = require('../controllers/actions.js');
const { isAuthenticated } = require('../middleware/authenticate.js');

/**
 * REQUEST  PATH                PRIVACY         PURPOSE
 * GET      /                   Public          View list of all actions
 * GET      /:actionId          Public          View action details
 * POST     /                   User            Create new action
 * PUT      /:actionId          User            Modify action
 * DELETE   /:actionId          User            Remove action (Dangerous)
*/ 

router.get('/', actionsController.getActions);
router.get('/:actionId', actionsController.getAction);
router.post('/', actionsController.createAction);
router.put('/:actionId', actionsController.modifyAction);
router.delete('/:actionId', actionsController.removeAction);

module.exports = router;