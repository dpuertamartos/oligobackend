const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Oligo = require('../models/oligo')

const initialOligos = [
    {
        date: new Date(),
        sequence: "ATTGGAGG"
    },
    {
        date: new Date(),
        sequence: "ATTGGAGG"
    },
  ]

beforeEach(async () => {
    await Oligo.deleteMany({})
    let oligoObject = new Oligo(initialOligos[0])
    await oligoObject.save()
    oligoObject = new Oligo(initialOligos[1])
    await oligoObject.save()
},30000) 

test('oligos are returned as json', async () => {
  await api
    .get('/api/oligos')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},300000)

test('there are two oligo', async () => {
    const response = await api.get('/api/oligos')
  
    expect(response.body).toHaveLength(initialOligos.length)
  },300000)

test('the first oligo is ATTGGAGG', async () => {
    const response = await api.get('/api/oligos')

    const contents = response.body.map(r=>r.sequence)
    expect(contents).toContain('ATTGGAGG')

},30000)

afterAll(() => {
  mongoose.connection.close()
})