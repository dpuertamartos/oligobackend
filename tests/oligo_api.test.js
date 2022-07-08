const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Oligo = require('../models/oligo')


beforeEach(async () => {
    await Oligo.deleteMany({})
    for (let o of helper.initialOligos) {
        let oligoObject = new Oligo(o)
        await oligoObject.save()
    }
},300000) 

test('oligos are returned as json', async () => {
  await api
    .get('/api/oligos')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},300000)

test('there are two oligo', async () => {
    const response = await api.get('/api/oligos')
  
    expect(response.body).toHaveLength(helper.initialOligos.length)
},300000)

test('the first oligo is ATTGGAGG', async () => {
    const response = await api.get('/api/oligos')

    const sequences = response.body.map(r=>r.sequence)
    expect(sequences).toContain('ATTGGAGG')

},30000)

test('a valid oligo can be added', async () => {
    const newOligo = {
        date: new Date(),
        sequence: 'ATTGG'
    }
  
    await api
      .post('/api/oligos')
      .send(newOligo)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    
    const oligosAtEnd = await helper.oligosInDb()
    expect(oligosAtEnd).toHaveLength(helper.initialOligos.length + 1)
    const sequences = oligosAtEnd.map(r => r.sequence)
    expect(sequences).toContain(
      'ATTGG'
    )
},300000)

test('a non valid oligo cannot be added', async () => {
    const newOligo = {
        date: new Date(),
        sequence: 'ATT'
    }
  
    await api
      .post('/api/oligos')
      .send(newOligo)
      .expect(400)
  
    const oligosAtEnd = await helper.oligosInDb()
    expect(oligosAtEnd).toHaveLength(helper.initialOligos.length)
},300000)

test('a specific oligo can be viewed', async () => {
    const oligosAtStart = await helper.oligosInDb()
  
    const oligoToView = oligosAtStart[0]
  
    const resultoligo = await api
      .get(`/api/oligos/${oligoToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const processedoligoToView = JSON.parse(JSON.stringify(oligoToView))
  
    expect(resultoligo.body).toEqual(processedoligoToView)
})
  
test('a oligo can be deleted', async () => {
    const oligosAtStart = await helper.oligosInDb()
    const oligoToDelete = oligosAtStart[0]
  
    await api
      .delete(`/api/oligos/${oligoToDelete.id}`)
      .expect(204)
  
    const oligosAtEnd = await helper.oligosInDb()
  
    expect(oligosAtEnd).toHaveLength(
      helper.initialOligos.length - 1
    )
  
    const sequences = oligosAtEnd.map(r => r.sequence)
  
    expect(sequences).not.toContain(oligoToDelete.sequence)
})

afterAll(() => {
  mongoose.connection.close()
})