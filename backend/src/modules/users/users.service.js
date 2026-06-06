const bcrypt = require('bcrypt');
const UsersRepository = require('./users.repository');
const AuditService = require('../../services/audit.service');
const { NotFoundError, ConflictError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class UsersService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'email', 'firstName']);

    const where = {};
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const { users, total } = await UsersRepository.findAll({ skip, take, orderBy, where });
    return { users, total, page, limit };
  }

  static async getById(id) {
    const user = await UsersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    return user;
  }

  static async create(data) {
    const passwordHash = await bcrypt.hash(data.password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    return UsersRepository.create({ ...data, password: undefined, passwordHash });
  }

  static async update(id, data, updatedBy) {
    const user = await UsersRepository.findById(id);
    if (!user) throw new NotFoundError('User');

    const updated = await UsersRepository.update(id, data);
    await AuditService.log({ userId: updatedBy, tableName: 'users', recordId: id, action: 'UPDATE', newValues: data });
    return updated;
  }

  static async remove(id, deletedBy) {
    const user = await UsersRepository.findById(id);
    if (!user) throw new NotFoundError('User');
    await UsersRepository.softDelete(id);
    await AuditService.log({ userId: deletedBy, tableName: 'users', recordId: id, action: 'DELETE' });
  }

  static async assignRoles(userId, roleIds, updatedBy) {
    const user = await UsersRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    await UsersRepository.assignRoles(userId, roleIds);
    await AuditService.log({ userId: updatedBy, tableName: 'user_roles', recordId: userId, action: 'UPDATE', newValues: { roleIds } });
  }
}

module.exports = UsersService;
