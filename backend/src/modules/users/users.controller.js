const UsersService = require('./users.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class UsersController {
  static list = asyncHandler(async (req, res) => {
    const { users, total, page, limit } = await UsersService.list(req.query);
    ApiResponse.paginated(res, { data: users, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const user = await UsersService.getById(req.params.id);
    ApiResponse.success(res, { data: user });
  });

  static create = asyncHandler(async (req, res) => {
    const user = await UsersService.create(req.body);
    ApiResponse.created(res, { data: user });
  });

  static update = asyncHandler(async (req, res) => {
    const user = await UsersService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { data: user, message: 'User updated' });
  });

  static remove = asyncHandler(async (req, res) => {
    await UsersService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'User deleted' });
  });

  static assignRoles = asyncHandler(async (req, res) => {
    await UsersService.assignRoles(req.params.id, req.body.roleIds, req.user.id);
    ApiResponse.success(res, { message: 'Roles assigned' });
  });
}

module.exports = UsersController;
