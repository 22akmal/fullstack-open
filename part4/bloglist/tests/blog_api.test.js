const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlog)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog saving fails because unporvided token', async () => {
    const newUser = {
      username: 'adit',
      name: 'Adit',
      password: 'abcd',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const newBlog = {
      title: "prince",
      author: "adit",
      url: "abcde"
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlog.length)
  })

  test('blog posts have id property', async () => {
    const response = await api.get('/api/blogs')
    const idCheck = response.body.every((item) => {
      return Object.hasOwn(item, 'id')
    })
    assert(idCheck)
  })

  test('a valid blog post can be added', async () => {
    const newBlog = {
      title: "Atlantis",
      author: "Plato",
      url: "dfw0933",
      likes: 54,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes("Atlantis"))
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogAtStart = await helper.blogsInDb()
      const blogToDelete = blogAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogAtEnd = await helper.blogsInDb()
      const ids = blogAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogAtEnd.length, blogAtStart.length - 1)
    })
  })

  describe('updating a blog post', () => {
    test('adding like of a blog psts', async () => {
      const blogAtStart = await helper.blogsInDb()
      const blogToUpdate = blogAtStart[0]
      const initialLike = blogToUpdate.likes

      const updatedData = {
        ...blogToUpdate,
        likes: initialLike + 1
      }

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedData)

      const blogUpdated = await api.get(`/api/blogs/${blogToUpdate.id}`)
      assert.strictEqual(blogUpdated.body.likes, initialLike + 1)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcryptjs.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb()

    const newUser = {
      username: 'adam',
      name: 'Adam',
      password: 'abcd',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userAtEnd = await helper.usersInDb()
    assert.strictEqual(userAtEnd.length, userAtStart.length + 1)

    const usernames = userAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with invalid password and username with length less than 3', async () => {
    const newUser = {
      username: 'Sa',
      name: 'sarah',
      password: 'ab'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('creation fails with common username', async () => {
    const newUser = {
      username: 'hera',
      name: 'Hera sera',
      password: 'abcde'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const newUser2 = {
      username: 'hera',
      name: 'Selen hera',
      password: '231uje'
    }

    await api
      .post('/api/users')
      .send(newUser2)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
