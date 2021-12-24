const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')

test('Login with correct credentials returns status code 200, token, username and name', async () => {

  const loginTest = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(loginTest)
    .expect(200)
    .expect('Content-type', /application\/json/)

  // console.log(response.body.token)
  expect(response.body).toHaveProperty('token')
  expect(response.body.username).toBe('root')
  expect(response.body.name).toBe('new test subject')
})

afterAll(() => mongoose.connection.close())