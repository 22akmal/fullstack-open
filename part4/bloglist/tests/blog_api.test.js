const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const blog = require('../models/blog')

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
    test.only('adding like of a blog psts', async () => {
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


after(async () => {
  await mongoose.connection.close()
})
