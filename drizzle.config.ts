import 'dotenv/config'
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/entity/index.ts',
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    // password: 'a',
    database: 'englishmaster',
  },
})
