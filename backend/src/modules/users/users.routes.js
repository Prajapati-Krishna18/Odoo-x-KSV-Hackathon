const { Router } = require('express');
const UsersController = require('./users.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const validate = require('../../middleware/validate');
const { createUserSchema, updateUserSchema, assignRolesSchema } = require('./users.validator');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

router.use(authenticate);

router.get('/', authorize('user.read'), UsersController.list);
router.get('/:id', authorize('user.read'), UsersController.getById);
router.post('/', authorize('user.create'), validate(createUserSchema), UsersController.create);
router.put('/:id', authorize('user.update'), validate(updateUserSchema), UsersController.update);
router.delete('/:id', authorize('user.delete'), UsersController.remove);
router.put('/:id/roles', authorize('user.update'), validate(assignRolesSchema), UsersController.assignRoles);

module.exports = router;
