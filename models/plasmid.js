const mongoose = require('mongoose')

const plasmidSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  name: {type: String, minLength: 2},
  description: {type: String, minLength: 2},
  sequence: {type: String, minLength: 4, required: true},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  oligos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Oligo'
    }
  ],
  genes: [
      {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gene"
    }
  ]
})

plasmidSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Plasmid', plasmidSchema)