import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { Students, Users } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/', async (req, res) => {
  const username = req.body.username

  let missingFields: string[] = []
  if (!username) missingFields.push('username')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedUser = await db.select().from(Users).where(eq(Users.username, username))

    if (selectedUser.length === 0) {
      res.status(404).send(`User "${username}" not found`)
      return
    }

    let selectedStudent = await db.select().from(Students).where((eq(Students.userID, selectedUser[0].id)))

    if (selectedStudent.length === 0) {
      res.status(404).send(`Student "${username}" not found`)
      return
    }

    res.send({
      ...selectedUser[0],
      ...selectedStudent[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const name = req.body.name
  const gender = req.body.gender
  const phoneNumber = req.body.phoneNumber
  const address = req.body.address
  const dateOfBirth = req.body.dateOfBirth

  let missingFields: string[] = []
  if (!username) missingFields.push('username')
  if (!password) missingFields.push('password')
  if (!email) missingFields.push('email')
  if (!name) missingFields.push('name')
  if (!gender) missingFields.push('gender')
  if (!phoneNumber) missingFields.push('phoneNumber')
  if (!address) missingFields.push('address')
  if (!dateOfBirth) missingFields.push('dateOfBirth')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let insertedUser = await db.insert(Users).values({
      username,
      password,
      email,
      name,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
      role: 'student',
    })

    await db.insert(Students).values({ userID: insertedUser[0].insertId })

    res.send('Student added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const username = req.body.username

  if (!username) {
    res.status(400).send('Username is required')
    return
  }

  const email = req.body.email
  const name = req.body.name
  const age = req.body.age
  const gender = req.body.gender
  const phoneNumber = req.body.phoneNumber
  const address = req.body.address
  const dateOfBirth = req.body.dateOfBirth

  let set1 = {}
  if (email) set1['email'] = email
  if (name) set1['name'] = name
  if (age) set1['age'] = age
  if (gender) set1['gender'] = gender
  if (phoneNumber) set1['phoneNumber'] = phoneNumber
  if (address) set1['address'] = address

  let set2 = {}
  if (dateOfBirth) set2['dateOfBirth'] = dateOfBirth

  try {
    if (Object.keys(set1).length > 0) await db.update(Users).set(set1).where(eq(Users.username, username))
    if (Object.keys(set2).length > 0) await db.update(Students).set(set2).where(eq(Students.userID, username))

    res.send('Student updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const username = req.body.username

  if (!username) {
    res.status(400).send('Username is required')
    return
  }

  try {
    await db.delete(Users).where(eq(Users.username, username))
    await db.delete(Students).where(eq(Students.userID, username))

    res.send('Student deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter