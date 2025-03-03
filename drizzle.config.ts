import 'dotenv/config'
import { defineConfig } from "drizzle-kit"
import mysql from 'mysql2/promise'

const checkAndCreateDatabase = async () => {
  console.log('Connecting to MySQL...')

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST!,
    port: +process.env.DATABASE_PORT!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
  })

  const dbName = process.env.DATABASE_NAME!

  const [rows] = await connection.query(`SHOW DATABASES LIKE ?`, [dbName])

  if (Array.isArray(rows)) {
    if (rows.length > 0) {
      console.log('Dropping Database...')
      await connection.query(`DROP DATABASE ${dbName}`)
    }

    console.log('Creating Database...')
    await connection.query(`CREATE DATABASE ${dbName}`)
  }

  await connection.end()
  console.log('Finished creating database.')
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
