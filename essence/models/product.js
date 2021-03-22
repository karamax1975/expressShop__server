const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true, unique: true },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  activity: { type: Boolean, required: true },
  autor: { type: Types.ObjectId, ref: 'users' },
  date: { type: Date, required: true },
  category: [{ id: { type: Types.ObjectId, ref: 'products' }, name: { type: String, required: true } }],
  preview: { type: String, required: true },
  previews: [{ type: String, required: true }],
  details: [{
    name: { type: String, required: false },
    description: { type: String, required: false }
  }],
  promotion: {
    discount: Number, required: false,
    promo: [{ type: Types.ObjectId, ref: 'promotions' }]
  }
})
module.exports = model('Product', schema)