const oligosRouter = require('express').Router()
const Oligo = require('../models/oligo')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

oligosRouter.get('/', async (request, response) => {
    const oligos = await Oligo.find({}).populate('user', {name: 1})
    response.json(oligos)
})
   

oligosRouter.get('/:id', async (request, response) => {
    const oligo = await Oligo.findById(request.params.id)
    if (oligo) {
        response.json(oligo)
    } else {
        response.status(404).end()
    }  
})

oligosRouter.delete('/:id', async (request, response) => {
    await Oligo.findByIdAndRemove(request.params.id)
    response.status(204).end() 
})

oligosRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const oligo = new Oligo({
        date: new Date(),
        sequence: body.sequence,
        user: user._id
    })
    
    const savedO = await oligo.save()
    user.oligos = user.oligos.concat(savedO._id)
    await user.save()
    response.status(201).json(savedO)    
   
})

oligosRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const oligo = {
        sequence: body.sequence
    }

    Oligo.findByIdAndUpdate(
        request.params.id, oligo, { new: true, runValidators: true, context: 'query' })
        .then(updatedOligo => {
        response.json(updatedOligo)
        })
        .catch(error => next(error))
})

module.exports = oligosRouter