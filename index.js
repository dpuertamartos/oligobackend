require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Oligo = require('./models/oligo')


app.use(express.static('build'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/api/oligos', (request, response) => {
  Oligo.find({}).then(oligos => {
    response.json(oligos)
  })
})


app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})


app.get('/api/oligos/:id', (request, response, next) => {
  Oligo.findById(request.params.id)
    .then(oligo => {
      oligo
        ? response.json(oligo)
        : response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Oligo.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/oligos', (request, response, next) => {
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

app.put('/api/notes/:id', (request, response, next) => {
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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message})
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})