// ============================================
// Database Seed Script
// ============================================
// Creates: roles, permissions, role-permission mappings,
// admin user, sample vendor categories.
// Run: node prisma/seed.js
// ============================================

require('dotenv').config();
const prisma = require('../src/config/database');
const bcrypt = require('bcrypt');

async function main() {
  console.log('🌱 Seeding VendorBridge database...\n');

  // ── 1. Create Permissions ──
  const modules = [
    'user', 'role', 'vendor', 'rfq', 'quotation',
    'approval', 'purchase_order', 'invoice', 'notification',
    'analytics', 'audit',
  ];
  const actions = ['create', 'read', 'update', 'delete', 'approve', 'export'];

  const permissions = [];
  for (const module of modules) {
    for (const action of actions) {
      permissions.push({ module, action, description: `${action} ${module}` });
    }
  }

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { module_action: { module: perm.module, action: perm.action } },
      update: {},
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} permissions created`);

  // ── 2. Create Roles ──
  const roles = [
    { name: 'admin', description: 'Full system access', isSystemRole: true },
    { name: 'procurement_manager', description: 'Manage procurement processes', isSystemRole: true },
    { name: 'procurement_officer', description: 'Create and manage RFQs', isSystemRole: true },
    { name: 'approver', description: 'Approve purchase orders and invoices', isSystemRole: true },
    { name: 'finance', description: 'Manage invoices and payments', isSystemRole: true },
    { name: 'vendor', description: 'Vendor portal access', isSystemRole: true },
    { name: 'viewer', description: 'Read-only access', isSystemRole: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log(`✅ ${roles.length} roles created`);

  // ── 3. Assign Permissions to Roles ──
  const allPermissions = await prisma.permission.findMany();
  const allRoles = await prisma.role.findMany();

  const rolePermMap = {
    admin: allPermissions.map((p) => p.id), // Admin gets everything
    procurement_manager: allPermissions
      .filter((p) => ['vendor', 'rfq', 'quotation', 'purchase_order', 'approval', 'analytics'].includes(p.module))
      .map((p) => p.id),
    procurement_officer: allPermissions
      .filter((p) =>
        (['vendor', 'rfq', 'quotation'].includes(p.module) && ['create', 'read', 'update'].includes(p.action)) ||
        (p.module === 'purchase_order' && ['create', 'read'].includes(p.action)) ||
        (p.module === 'analytics' && p.action === 'read')
      )
      .map((p) => p.id),
    approver: allPermissions
      .filter((p) =>
        (p.module === 'approval' && ['read', 'approve'].includes(p.action)) ||
        (['rfq', 'quotation', 'purchase_order'].includes(p.module) && p.action === 'read')
      )
      .map((p) => p.id),
    finance: allPermissions
      .filter((p) =>
        (['invoice'].includes(p.module)) ||
        (['purchase_order', 'analytics'].includes(p.module) && p.action === 'read')
      )
      .map((p) => p.id),
    vendor: allPermissions
      .filter((p) =>
        (p.module === 'quotation' && ['create', 'read', 'update'].includes(p.action)) ||
        (p.module === 'rfq' && p.action === 'read') ||
        (p.module === 'notification' && p.action === 'read')
      )
      .map((p) => p.id),
    viewer: allPermissions
      .filter((p) => p.action === 'read')
      .map((p) => p.id),
  };

  for (const role of allRoles) {
    const permIds = rolePermMap[role.name] || [];
    for (const permId of permIds) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
        update: {},
        create: { roleId: role.id, permissionId: permId },
      });
    }
  }
  console.log('✅ Role-permission mappings created');

  // ── 4. Create Admin User ──
  const adminRole = allRoles.find((r) => r.name === 'admin');
  const passwordHash = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendorbridge.com' },
    update: {},
    create: {
      email: 'admin@vendorbridge.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      phone: '+1234567890',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
    update: {},
    create: { userId: admin.id, roleId: adminRole.id },
  });
  console.log('✅ Admin user created (admin@vendorbridge.com / Admin@123)');

  // ── 5. Create Sample Vendor Categories ──
  const categories = [
    { name: 'IT Services', description: 'Software, hardware, and IT consulting' },
    { name: 'Office Supplies', description: 'Stationery, furniture, equipment' },
    { name: 'Raw Materials', description: 'Manufacturing inputs and commodities' },
    { name: 'Professional Services', description: 'Legal, accounting, consulting' },
    { name: 'Logistics', description: 'Shipping, transportation, warehousing' },
    { name: 'Marketing', description: 'Advertising, PR, creative agencies' },
    { name: 'Maintenance', description: 'Facilities, repair, janitorial' },
    { name: 'Healthcare', description: 'Medical supplies and services' },
  ];

  for (const cat of categories) {
    await prisma.vendorCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} vendor categories created`);

  // ── 6. Create Demo Users ──
  const demoUsers = [
    { email: 'john@vendorbridge.com', firstName: 'John', lastName: 'Procurement', role: 'procurement_officer' },
    { email: 'jane@vendorbridge.com', firstName: 'Jane', lastName: 'Manager', role: 'procurement_manager' },
    { email: 'mike@vendorbridge.com', firstName: 'Mike', lastName: 'Approver', role: 'approver' },
    { email: 'sara@vendorbridge.com', firstName: 'Sara', lastName: 'Finance', role: 'finance' },
    { email: 'vendor1@acme.com', firstName: 'Vendor', lastName: 'One', role: 'vendor' },
  ];

  for (const du of demoUsers) {
    const hash = await bcrypt.hash('Demo@123', 12);
    const user = await prisma.user.upsert({
      where: { email: du.email },
      update: {},
      create: { email: du.email, passwordHash: hash, firstName: du.firstName, lastName: du.lastName, isActive: true },
    });
    const role = allRoles.find((r) => r.name === du.role);
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }
  }
  console.log('✅ Demo users created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin:  admin@vendorbridge.com / Admin@123');
  console.log('  Demo:   john@vendorbridge.com  / Demo@123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
