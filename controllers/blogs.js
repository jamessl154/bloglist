const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

// const mongoose = require('mongoose')
// mongoose.set('debug', true)

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

// register middleware exclusive to the post + delete route
// that gives access to request.user which is the ID of the logged in user that sent the request
blogsRouter.post('/', middleware.userExtractor,  async (request, response, next) => {

  try {
    const body = request.body

    const user = await User.findById(request.user)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()

    // Concatenate the blog id to the blogs array of the user in users
    await user.updateOne({ blogs: user.blogs.concat(savedBlog._id) })

    await savedBlog.populate('user', { username: 1, name: 1 })

    response.json(savedBlog)

  } catch(exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {

  try {
    const id = request.params.id

    const blog = await Blog.findById(id)

    // request.user is from userExtractor middleware. the middleware parses the request header for
    // the token and decodes it for the id of the logged-in user that sent this request

    if (blog.user.toString() !== request.user.toString()) {
      return response.status(403).json({ error: 'You can only delete blogs that you have created' })
    }

    await Blog.findByIdAndDelete(id)

    const user = await User.findById(request.user)

    // remove the blog from blogs array in users document
    let newBlogs = user.blogs.filter((x) => x.toString() !== blog._id.toString())

    await user.updateOne({ blogs: newBlogs })

    response.status(204).end()

  } catch(exception) {
    // invalid ID 400 bad request
    // or token is from a different user 401 unauthorized
    // doesn't catch non-existent resource
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id  = request.params.id
  const blog = request.body

  try {
    const result = await Blog
      .findByIdAndUpdate(id, blog, { new: true })
      .populate('user', { username: 1, name: 1 })
    response.json(result)
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {

  const id = request.params.id
  const comment = request.body.comment

  try {
    const blog = await Blog.findById(id)
    const result = await Blog
      .findByIdAndUpdate(
        id,
        { comments: blog.comments.concat(comment) },
        { new: true }
      )
    response.json(result)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter