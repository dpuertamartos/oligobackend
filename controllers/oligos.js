const oligosRouter = require('express').Router()
const Oligo = require('../models/oligo')
const User = require('../models/user')

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

    const user = await User.findById(body.userId)

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