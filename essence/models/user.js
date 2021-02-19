const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  ID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: false },
  products: [{ type: Types.ObjectId, ref: 'Products' }]
})
module.exports = model('User', schema)