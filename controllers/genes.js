const genesRouter = require('express').Router()
const Gene = require('../models/gene')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

genesRouter.get('/', async (request, response) => {
    const genes = await Gene.find({}).populate('oligos', {sequence: 1})
    response.json(genes)
})
   

genesRouter.get('/:id', async (request, response) => {
    const gene = await Gene.findById(request.params.id)
    if (gene) {
        response.json(gene)
    } else {
        response.status(404).end()
    }  
})

genesRouter.delete('/:id', async (request, response) => {
    await Gene.findByIdAndRemove(request.params.id)
    response.status(204).end() 
})

genesRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    const gene = new Gene({
        date: new Date(),
        name: body.name,
        description: body.description,
        sequence: body.sequence,
        organism: body.organism
    })
    
    const savedGene = await gene.save()
    response.status(201).json(savedGene)    
   
})

genesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const gene = {
        sequence: body.sequence
    }

    Gene.findByIdAndUpdate(
        request.params.id, gene, { new: true, runValidators: true, context: 'query' })
        .then(updatedGene => {
        response.json(updatedGene)
        })
        .catch(error => next(error))
})

module.exports = genesRouter