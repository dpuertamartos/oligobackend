const Oligo = require('../models/oligo')
const User = require('../models/user')

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
  initialOligos, nonExistingId, oligosInDb, usersInDb
}