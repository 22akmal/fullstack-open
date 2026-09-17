const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
  {
    title: "Prince of Bahamas",
    author: "adam",
    url: "abcd",
    likes: 2
  },
  {
    title: "The Prince",
    author: "Helen",
    url: "efgh",
    likes: 45
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = { initialBlog, blogsInDb, usersInDb }