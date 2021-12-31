const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const helper = require('../utils/api_test_helper')
const jwt = require('jsonwebtoken')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  // Regex checker for password strength before the password is hashed
  const testPass = helper.strongPassword(body.password)

  const takenUsername = await User.findOne({ username: body.username })

  if (takenUsername) {
    return response.status(409).json({
      error: 'This username is taken, please choose another'
    })
  }

  if(!testPass) {
    return response.status(400).json({
      error: 'Password must contain at least 1 upper case, ' +
      '1 lower case, 1 numeric and 1 symbol character'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token, username: savedUser.username, name: savedUser.name })

  } catch(exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')
  response.json(users)
})

module.exports = usersRouter