import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { Teachers, Users } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/', async (req, res) => {
  const username = req.body.username

  const missingFields: string[] = []
  if (!username) missingFields.push('username')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    const selectedUsers = await db.select().from(Users).where(eq(Users.username, username))

    if (selectedUsers.length === 0) {
      res.status(404).send(`User "${username}" not found`)
      return
    }

    const selectedTeachers = await db.select().from(Teachers).where((eq(Teachers.userID, selectedUsers[0].id)))

    if (selectedTeachers.length === 0) {
      res.status(404).send(`Teacher "${username}" not found`)
      return
    }

    res.send({
      ...selectedUsers[0],
      ...selectedTeachers[0]
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
  const age = req.body.age
  const gender = req.body.gender
  const phoneNumber = req.body.phoneNumber
  const address = req.body.address
  const specialization = req.body.specialization
  const experience = req.body.experience

  const missingFields: string[] = []
  if (!username) missingFields.push('username')
  if (!password) missingFields.push('password')
  if (!email) missingFields.push('email')
  if (!name) missingFields.push('name')
  if (!age) missingFields.push('age')
  if (!gender) missingFields.push('gender')
  if (!phoneNumber) missingFields.push('phoneNumber')
  if (!address) missingFields.push('address')
  if (!specialization) missingFields.push('specialization')
  if (!experience) missingFields.push('experience')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    const insertedUser = await db.insert(Users).values({
      username,
      password,
      email,
      name,
      age,
      gender,
      phoneNumber,
      address,
      role: 'teacher',
    })

    await db.insert(Teachers).values({ userID: insertedUser[0].insertId, specialization, experience })

    res.send('Teacher added')
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
  const specialization = req.body.specialization
  const experience = req.body.experience

  const set1 = {}
  if (email) set1['email'] = email
  if (name) set1['name'] = name
  if (age) set1['age'] = age
  if (gender) set1['gender'] = gender
  if (phoneNumber) set1['phoneNumber'] = phoneNumber
  if (address) set1['address'] = address

  const set2 = {}
  if (specialization) set2['specialization'] = specialization
  if (experience) set2['experience'] = experience

  try {
    if (Object.keys(set1).length > 0) await db.update(Users).set(set1).where(eq(Users.username, username))
    if (Object.keys(set2).length > 0) await db.update(Teachers).set(set2).where(eq(Teachers.userID, username))

    res.send('Teacher updated')
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
    await db.delete(Teachers).where(eq(Teachers.userID, username))

    res.send('Teacher deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter