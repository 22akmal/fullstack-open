const usersRouter = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const {username, name, password} = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({error: "the length of password and username must be at least 3"})
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const result = await User.find({}).populate('blogs')
  response.status(200).json(result)
})

module.exports = usersRouter