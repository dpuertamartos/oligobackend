const plasmidsRouter = require('express').Router()
const Plasmid = require('../models/plasmid')
const User = require('../models/user')
const Gene = require('../models/gene')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

plasmidsRouter.get('/', async (request, response) => {
    const plasmid = await Plasmid.find({})
        .populate('user', {name: 1})
        .populate('oligos', {name: 1})
    response.json(plasmid)
})
   

plasmidsRouter.get('/:id', async (request, response) => {
    const plasmid = await Plasmid.findById(request.params.id)
    if (plasmid) {
        response.json(Plasmid)
    } else {
        response.status(404).end()
    }  
})

plasmidsRouter.delete('/:id', async (request, response) => {
    await Plasmid.findByIdAndRemove(request.params.id)
    response.status(204).end() 
})

plasmidsRouter.post('/', async (request, response) => {
    const body = request.body

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    
    console.log(body.genes, typeof body.genes)
    
    // convert string array into array of strings
    let a = body.genes
    a = a.replace(/\[|\]/g,'').split(',')

    const plasmid = new Plasmid({
        date: new Date(),
        name: body.name,
        description: body.description,
        sequence: body.sequence,
        user: user._id,
        genes: a,
    })
    
    const savedp = await plasmid.save()
    user.plasmids = user.plasmids.concat(savedp._id)
    await user.save()
    for(id of a){
        const gene = await Gene.findById(id)
        gene.plasmids = gene.plasmids.concat(savedp._id)
        await gene.save()
    }
    response.status(201).json(savedp)    
   
})

plasmidsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const plasmid = {
        sequence: body.sequence
    }

    Plasmid.findByIdAndUpdate(
        request.params.id, plasmid, { new: true, runValidators: true, context: 'query' })
        .then(updatedPlasmid => {
        response.json(updatedPlasmid)
        })
        .catch(error => next(error))
})

module.exports = plasmidsRouter