const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
// make gene name unique
const geneSchema = new mongoose.Schema({
  date: {type: Date, required: true},
  name: {type: String, minLength: 2, required: true, unique: true},
  description: {type: String, minLength: 2},
  sequence: {type: String, minLength: 4, required: true},
  organism: {type: String, minLength: 4, required: true},
  oligos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Oligo'
    }
  ],
  plasmids: [
      {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plasmid"
    }
  ]
})

geneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

geneSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Gene', geneSchema)