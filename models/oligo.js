const mongoose = require('mongoose')

const oligoSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  sequence: {type: String, minLength: 4, required: true}
})

oligoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Oligo', oligoSchema)