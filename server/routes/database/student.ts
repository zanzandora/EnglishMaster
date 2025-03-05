import { Router } from 'express'
import { eq } from 'drizzle-orm'

import { Students } from '../../database/entity'
import { db } from '../../database/driver'

const expressRouter = Router()

expressRouter.get('/list', async (req, res) => {
  try {
    let allStudents = await db.select().from(Students)

    res.send(allStudents)
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.get('/', async (req, res) => {
  const id = req.body.id

  let missingFields: string[] = []
  if (!id) missingFields.push('id')
  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    let selectedStudent = await db.select().from(Students).where((eq(Students.id, id)))

    if (selectedStudent.length === 0) {
      res.status(404).send(`Student "${id}" not found`)
      return
    }

    res.send({
      ...selectedStudent[0]
    })
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/add', async (req, res) => {
  const name = req.body.name
  const phoneNumber = req.body.phoneNumber
  const email = req.body.email
  const dateOfBirth = req.body.dateOfBirth
  const gender = req.body.gender
  const address = req.body.address
  const photo = req.body.photo

  let missingFields: string[] = []
  if (!name) missingFields.push('name')
  if (!phoneNumber) missingFields.push('phoneNumber')
  if (!email) missingFields.push('email')
  if (!dateOfBirth) missingFields.push('dateOfBirth')
  if (!gender) missingFields.push('gender')
  if (!address) missingFields.push('address')
  if (!photo) missingFields.push('photo')

  if (missingFields.length > 0) {
    res.status(400).send(`Missing fields: ${missingFields.join(', ')}`)
    return
  }

  try {
    await db.insert(Students).values({
      name,
      phoneNumber,
      email,
      dateOfBirth,
      gender,
      address,
      photo
    })

    res.send('Student added')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }

})

expressRouter.post('/edit', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('ID is required')
    return
  }

  const name = req.body.name
  const phoneNumber = req.body.phoneNumber
  const email = req.body.email
  const dateOfBirth = req.body.dateOfBirth
  const gender = req.body.gender
  const address = req.body.address
  const photo = req.body.photo

  let set = {}
  if (email) set['email'] = email
  if (name) set['name'] = name
  if (dateOfBirth) set['dateOfBirth'] = dateOfBirth
  if (gender) set['gender'] = gender
  if (phoneNumber) set['phoneNumber'] = phoneNumber
  if (address) set['address'] = address

  try {
    if (Object.keys(set).length > 0) await db.update(Students).set(set).where(eq(Students.id, id))

    res.send('Student updated')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

expressRouter.post('/delete', async (req, res) => {
  const id = req.body.id

  if (!id) {
    res.status(400).send('ID is required')
    return
  }

  try {
    await db.delete(Students).where(eq(Students.id, id))

    res.send('Student deleted')
  }
  catch (err) {
    res.status(500).send(err.toString())
  }
})

export const router = expressRouter