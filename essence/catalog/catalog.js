const catalogModel = require('../models/catalog');

class Catalog {

  async getCatalogList() {
    const list = await catalogModel.find();
    if (list) return list
    else return false
  }

  async createPosition(req) {
    let { name, parent } = req;
    const newCatalogItem = new catalogModel({ name, parent })
    const rezult = await newCatalogItem.save();
    if (rezult) return rezult
    else return false
    // const find = await catalogModel.findOne({ name });
    // if (!find) {
    //   const newCatalogItem = new catalogModel({ name, parent })
    //   return await newCatalogItem.save();
    // }
    // else return false
  }
  async delPosition(req) {
    const { id } = req;
    const find = await catalogModel.find({ 'parent.id': id });
    if (find.length > 0) {
      catalogModel.deleteMany({ 'parent.id': id });
    }
    const delItem = await catalogModel.deleteOne({ _id: id })
    if (delItem) return true;
    else return false
  }
}

module.exports = Catalog;