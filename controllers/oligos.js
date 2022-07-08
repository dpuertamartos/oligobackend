const oligosRouter = require('express').Router()
const Oligo = require('../models/oligo')

oligosRouter.get('/', (request, response) => {
    Oligo.find({}).then(oligos => {
      response.json(oligos)
    })
  })
   

oligosRouter.get('/:id', (request, response, next) => {
    Oligo.findById(request.params.id)
        .then(oligo => {
        oligo
            ? response.json(oligo)
            : response.status(404).end()
        })
        .catch(error => next(error))
})

oligosRouter.delete('/:id', (request, response, next) => {
    Oligo.findByIdAndRemove(request.params.id)
        .then(result => {
        response.status(204).end()
        })
        .catch(error => next(error))
})

oligosRouter.post('/', (request, response, next) => {
    const body = request.body

    if (body.sequence === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }

    const oligo = new Oligo({
        date: new Date(),
        sequence: body.sequence
    })

    oligo.save()
        .then(savedOligo => {
        response.json(savedOligo)
        })
        .catch(error => next(error))
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