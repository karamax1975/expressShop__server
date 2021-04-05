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
  }
  async renamePosition(req) {
    const { id, newName } = req;
    const childrens = await catalogModel.updateMany({ 'parent.id': id }, { $set: { 'parent.name': newName } });
    const obj = await catalogModel.updateOne({ _id: id }, { $set: { name: newName } });
    if (obj.ok) return true
    else return false
  }

  async delPosition(req) {
    const { id } = req;
    const arrDelItem = await catalogModel.deleteMany({ 'parent.id': id });
    const delItem = await catalogModel.deleteOne({ _id: id })
    if (delItem || delItem && arrDelItem) return true;
    else return false
  }
}

module.exports = Catalog;