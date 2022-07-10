const oligosRouter = require('express').Router()
const Oligo = require('../models/oligo')
const User = require('../models/user')
const Gene = require('../models/gene')
const Plasmid = require('../models/plasmid')
const jwt = require('jsonwebtoken')
const gene = require('../models/gene')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

oligosRouter.get('/', async (request, response) => {
    const oligos = await Oligo.find({})
        .populate('user', {name: 1})
        .populate('plasmids', {name: 1})
        .populate('genes', {name: 1})
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

    if(body.genes){
        console.log(body.genes)
        body.genes = body.genes.replace(/\[|\]/g,'').split(',')
        console.log(body.genes)
    }
    else{body.genes = []}
    if(body.plasmids){body.plasmids = body.plasmids.replace(/\[|\]/g,'').split(',')}
    else{body.plasmids = []}

    const oligo = new Oligo({
        date: new Date(),
        name: body.name,
        sequence: body.sequence,
        user: user._id,
        genes: body.genes,
        plasmids: body.plasmids
    })
    
    const savedO = await oligo.save()
    user.oligos = user.oligos.concat(savedO._id)
    await user.save()
    for(let id of body.genes){
        const gene = await Gene.findById(id)
        gene.oligos = gene.oligos.concat(savedO._id)
        gene.save()
    }
    for(let id of body.plasmids){
        const plasmid = await Plasmid.findById(id)
        plasmid.oligos = plasmid.oligos.concat(savedO._id)
        plasmid.save()
    }
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