import 'dotenv/config'
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/entity/index.ts',
  dbCredentials: {
    host: process.env.DATABASE_HOST as any,
    port: process.env.DATABASE_PORT as any,
    user: process.env.DATABASE_USER as any,
    password: process.env.DATABASE_PASSWORD as any,
    database: process.env.DATABASE_NAME as any,
  },
})
