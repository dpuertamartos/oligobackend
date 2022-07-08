const Oligo = require('../models/oligo')

const initialOligos = [
    {
        date: new Date(),
        sequence: "ATTGGAGG"
    },
    {
        date: new Date(),
        sequence: "AGGTTGGG"
    },
]

const nonExistingId = async () => {
  const oligo = new Oligo({ sequence: 'willremovethissoon', date: new Date() })
  await oligo.save()
  await oligo.remove()

  return oligo._id.toString()
}

const oligosInDb = async () => {
  const oligos = await Oligo.find({})
  return oligos.map(o => o.toJSON())
}

module.exports = {
  initialOligos, nonExistingId, oligosInDb
}