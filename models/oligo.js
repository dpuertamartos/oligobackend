const mongoose = require('mongoose')

const oligoSchema = new mongoose.Schema({
  name: {type: String, minLength: 4},
  date: {type: Date, required: true},
  sequence: {type: String, minLength: 4, required: true},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  genes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gene'
    }
  ],
  plasmids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plasmid'
    }
  ]
})

oligoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Oligo', oligoSchema)