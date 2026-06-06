// ============================================
// Prisma 7 Configuration File
// ============================================
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrate: {
    async datasourceUrl() {
      return process.env.DATABASE_URL ?? '';
    },
  },
});
