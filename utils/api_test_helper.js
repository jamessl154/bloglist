const Blog = require('../models/blog')
const User = require ('../models/user')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'Joe Bloggs',
    author: 'Joe',
    url: 'joebloggs.io',
    likes: 1
  },
  {
    title: 'Bloggers',
    author: 'Jack',
    url: 'blogchamp.com',
    likes: 1
  },
]

const strongPassword = (password) => {
  // https://stackoverflow.com/a/7684859
  // Positive lookahead must contain at least 1 a-z, A-Z, 0-9, non-word char including _
  return /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])([a-zA-Z0-9\W_]+)$/.test(password)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getToken = async () => {

  // Always the same user in bloglist-db-test
  const user = await User.findOne({ username: 'root' })

  const userForToken = {
    username: user.username,
    id: user._id
  }

  return 'bearer ' + jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
  strongPassword,
  getToken
}