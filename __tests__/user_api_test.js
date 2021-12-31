const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/api_test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'new test subject', passwordHash })

    await user.save()
  })

  afterAll(() => mongoose.connection.close())

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: '!1Salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with correct statuscode/message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: '1!Salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('This username is taken, please choose another')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with correct statuscode/message if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'bl',
      name: 'Superuser',
      password: '1!Salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    // Error message that corresponds to the issue
    expect(result.body.error).toContain('Path `username`')
    expect(result.body.error).toContain('is shorter than the minimum allowed length')

    // not added - creation failed
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with correct statuscode/message if username contains non-permitted characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: '&gt:',
      name: 'Superuser',
      password: '!Salainen1',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must only contain alphanumeric characters')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with correct statuscode/message if password is not strong enough', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'boot',
      name: 'Superuser',
      password: 'Blablallasas',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must contain at least 1 upper case, 1 lower case, 1 numeric and 1 symbol character')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})