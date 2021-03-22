const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true },
  parent: {
    id: { type: Types.ObjectId, ref: 'catalogs' },
    name: { type: String }
  },
  products: [
    {
      id: { type: Types.ObjectId, ref: 'products' },
      name: { type: String }
    }
  ]
})


module.exports = model('Catalog', schema)