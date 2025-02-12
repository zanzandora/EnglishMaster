import 'dotenv/config'
import { defineConfig } from "drizzle-kit"
import mysql from 'mysql2/promise'

const checkAndCreateDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST!,
    port: +process.env.DATABASE_PORT!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
  })

  const dbName = process.env.DATABASE_NAME!

  const [rows] = await connection.query(`SHOW DATABASES LIKE ?`, [dbName])

  if (Array.isArray(rows) && rows.length === 0)
    await connection.query(`CREATE DATABASE ${dbName}`)

  await connection.end()

  console.log('Database ready and connected with Drizzle!')
}

checkAndCreateDatabase().catch(err => console.error(err))


export default defineConfig({
  dialect: 'mysql',
  schema: './server/database/entity/index.ts',
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: +process.env.DATABASE_PORT!,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
  },
})
