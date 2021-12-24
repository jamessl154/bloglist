const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/api_test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// Re-initialize the database
beforeEach(async () => {

  await Blog.deleteMany({})
  await User.deleteMany({})
  // To test all of the functionality of the blogs api we need to
  // add an id property to each blog that identifies which user added the blog.
  // this ID is reset every time we run user_api.test.js/the
  // blogs lose reference to a user that exists in the users collection
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'new test subject', passwordHash })

  const rootUser = await user.save()

  helper.initialBlogs[0].user = rootUser._id
  helper.initialBlogs[1].user = rootUser._id

  await Blog.insertMany(helper.initialBlogs)
})

test('Verify blog list returns correct number of blog posts in JSON format',
  async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()
    expect(response).toHaveLength(helper.initialBlogs.length)
  }, 100000
)

test('Verify the unique identifier property of blog posts is named id', async () => {
  const response = await helper.blogsInDb()

  let testSubject = response[0]
  expect(testSubject.id).toBeDefined()
})

test('post request to api/blogs creates new blog in DB and content correctly saved',
  async () => {
    const newBlog = {
      title: 'Blogs r us',
      author: 'Gill',
      url: 'upthehill.com',
      likes: 123
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      // each blog post requires a signed token in header
      .set('Authorization', await helper.getToken())
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    // +1 blog in the database
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    // https://mongoosejs.com/docs/api.html#model_Model.exists
    // .exists returns true if at least one document exists that matches this filter
    const DocumentExistsInDB = await Blog.exists({
      title: 'Blogs r us',
      author: 'Gill',
      url: 'upthehill.com',
      likes: 123
    })

    // https://jestjs.io/docs/expect#tobetruthy
    expect(DocumentExistsInDB).toBeTruthy()
  }
)

test('If likes missing from post request to api/blogs, default to 0',
  async () => {
    const newRequest = {
      title: 'Test123',
      author: 'Blabla',
      url: 'abc.com',
    }

    await api
      .post('/api/blogs')
      .send(newRequest)
      .set('Authorization', await helper.getToken())
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // https://mongoosejs.com/docs/api.html#model_Model.findOne
    // https://mongoosejs.com/docs/defaults.html
    const testSubject = await Blog.findOne({ title: 'Test123' })
    expect(testSubject.likes).toBe(0)
  }
)

test('If title + url missing from post request -> api/blogs expect status code 400',
  async () => {
    const blogObject = {
      author: 'Blogger',
      likes: 123
    }

    // Changed the Blog model's schema to require a title and url.
    // the blogsRouter catches the ValidationError when mapping the object
    // that doesn't match the schema which is then passed to the
    // errorHandler which returns 400 for ValidationErrors
    const result = await api
      .post('/api/blogs')
      .send(blogObject)
      .set('Authorization', await helper.getToken())
      .expect(400)

    expect(result.body.error).toContain('Path `title` is required., url: Path `url` is required')
  }
)

test('When delete request sent to api/blogs/:id, that blog is removed from the database',
  async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', await helper.getToken())
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    // expect 1 less blog in the database
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    // findById returns null if no match with that ID
    // expect the posted blog ID to not be in the DB after delete request
    const finder = await Blog.findById(blogToDelete.id)

    expect(finder).toEqual(null)
  }, 10000
)

test('Sending a put request to a api/blogs/:id updates the blog in the DB to the request',
  async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updateToDB = { likes: blogToUpdate.likes += 1 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateToDB)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updateFromDB = await Blog.findById(blogToUpdate.id)
    expect(updateFromDB.likes).toBe(2)
  }
)

test('Trying to add a blog without a token fails and returns the status code 401 Unauthorized',
  async () => {
    const newBlog = {
      title: 'Blogs r us',
      author: 'Gill',
      url: 'upthehill.com',
      likes: 123
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    // adding a blog fails
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  }
)

afterAll(() => mongoose.connection.close())