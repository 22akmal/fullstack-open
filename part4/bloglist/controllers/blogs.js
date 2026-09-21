const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const result = await Blog.find({}).populate('user')
  response.status(200).json(result)
})

blogRouter.get('/:id', async (request, response) => {
  const result = await Blog.findById(request.params.id)
  if (result) {
    response.json(result)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.token){
    return response.status(401).json({error: 'token unprovided'})
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user._id,
    url: body.url,
    likes: 0
  })

  const result = await blog.save()
  await blog.populate('user')
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  if (!request.token){
    return response.status(401).json({error: "token unprovided"})
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken){
    return response.status(401).json({error: "token invalid"})
  }

  const blog = await Blog.findById(blogId)
  if (!blog){
    return response.status(400).json({error: "blogId missing or not valid"})
  }

  if (blog.user.toString() === decodedToken.id.toString()){
    await Blog.findByIdAndDelete(blog.id)
    response.status(204).end()
  } else {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const result = await Blog.findById(request.params.id)
  if (!result) {
    return response.status(404).end()
  }

  result.user = blog.user
  result.likes = blog.likes
  result.author = blog.author
  result.title = blog.title
  result.url = blog.url

  const saveBlog = await result.save()
  await saveBlog.populate('user')
  response.json(saveBlog)
})

module.exports = blogRouter