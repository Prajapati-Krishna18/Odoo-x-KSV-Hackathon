const prisma = require('../../config/database');

class UsersRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { ...where, deletedAt: null },
        skip,
        take,
        orderBy,
        select: {
          id: true, email: true, firstName: true, lastName: true,
          phone: true, isActive: true, lastLoginAt: true, createdAt: true,
          userRoles: { select: { role: { select: { id: true, name: true } } } },
        },
      }),
      prisma.user.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { users, total };
  }

  static async findById(id) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, isActive: true, lastLoginAt: true, createdAt: true, updatedAt: true,
        userRoles: { select: { role: { select: { id: true, name: true } } } },
      },
    });
  }

  static async create(data) {
    return prisma.user.create({ data, select: { id: true, email: true, firstName: true, lastName: true, createdAt: true } });
  }

  static async update(id, data) {
    return prisma.user.update({ where: { id }, data });
  }

  static async softDelete(id) {
    return prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  static async assignRoles(userId, roleIds) {
    // Remove existing roles, assign new ones
    await prisma.userRole.deleteMany({ where: { userId } });
    const data = roleIds.map((roleId) => ({ userId, roleId }));
    return prisma.userRole.createMany({ data });
  }
}

module.exports = UsersRepository;
