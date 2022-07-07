const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
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

let oligos = [
    {   
      date: "2022-05-30T17:30:31.098Z",  
      id: 1,
      sequence: "AATTGG"
    },
    {
      date: "2022-05-30T17:30:31.098Z",  
      id: 2,
      sequence: "AAAGG"
    }
]

app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})

app.get('/api/oligos', (request, response) => {
response.json(oligos)
})

app.get('/api/oligos/:id', (request, response) => {
const id = Number(request.params.id)
const note = notes.find(note => note.id === id)
note 
    ? response.json(note)
    : response.status(404).end()

})

app.delete('/api/oligos/:id', (request, response) => {
const id = Number(request.params.id)
oligos = oligos.filter(oligo => oligo.id !== id)

response.status(204).end()
})

const generateId = () => {
const maxId = oligos.length > 0
    ? Math.max(...oligos.map(n => n.id))
    : 0
return maxId + 1
}

app.post('/api/oligos', (request, response) => {
    const body = request.body

    if (!body.sequence) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const oligo = {
        date: new Date(),
        id: generateId(),
        sequence: body.sequence
    }

    oligos = oligos.concat(oligo)

    response.json(oligo)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})