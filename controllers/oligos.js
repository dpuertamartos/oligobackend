const oligosRouter = require('express').Router()
const Oligo = require('../models/oligo')

oligosRouter.get('/', async (request, response) => {
    const oligos = await Oligo.find({})
    response.json(oligos)
})
   

oligosRouter.get('/:id', async (request, response, next) => {
    try {
        const oligo = await Oligo.findById(request.params.id)
        if (oligo) {
          response.json(oligo)
        } else {
          response.status(404).end()
        }
    } 
    catch(exception) {
        next(exception)
    }
})

oligosRouter.delete('/:id', async (request, response, next) => {
    try {
        await Oligo.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } 
    catch (exception) {
        next(exception)
    }
})

oligosRouter.post('/', async (request, response, next) => {
    const body = request.body

    /*  if (body.sequence === undefined) {
        return response.status(400).json({ error: 'content missing' })
    } */

    const oligo = new Oligo({
        date: new Date(),
        sequence: body.sequence
    })
    try {
        const savedO = await oligo.save()
        response.status(201).json(savedO)    
    }
    catch(exception){
        next(exception)
    }  
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