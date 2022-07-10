const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
      .populate('oligos', { sequence: 1 })
      .populate('plasmids', {name: 1, sequence: 1})
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  console.log(username,name,password)

  const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({
        error: 'username must be unique'
        })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(passwordHash)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter