const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
	const result = await Blog.find({})
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
	const blog = new Blog(request.body)

	const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const blog = request.body

  const result = await Blog.findById(request.params.id)
  if (!result){
    return response.status(404).end()
  }

  result.likes = blog.likes

  const saveBlog = await result.save()
  response.json(saveBlog)
})

module.exports = blogRouter