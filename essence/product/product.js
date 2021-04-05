const productModel = require('../models/product');
const categoryModel = require('../models/category');
const path = require('path');
const config = require('../../config')
const fs = require('fs')


class Product {

  async getListAllProducts() {
    // Задача: выбрать массив товаров, кроме шаблонного товара.
    // нахожу категорию "Шаблон"
    const categoryTemplate = await categoryModel.findOne({ name: 'Template' });
    // нахожу категорию "Шаблон" и получаю ее id
    const IdTemplate = categoryTemplate._id;
    // выбираю все продукты кроме тех, кто относится к категории "Шаблон"
    const list = await productModel.find({ 'category.id': { $ne: IdTemplate } });
    if (!list) {
      return false
    }
    else return list
    return true
  }

  async delPhoto(name) {
    let dirUpload = path.resolve(config.PROJECT_DIR, 'client', 'public', 'upload');
    if (process.env._NODE == 'BUILD') {
      dirUpload = path.resolve(config.PROJECT_DIR, 'client', 'build', 'upload');
    }
    fs.unlink(`${dirUpload}/${name}`, (err) => {
      if (err) throw err;
      console.log(`client/public/upload/${name} was deleted`);
      return true
    });
  }
  async delArrImg(arr) {
    const rezult = []
    arr.forEach(item => {
      const rez = this.delPhoto(item)
      if (rez) rezult.push(rez)
    })
    // пишу без проверки на скорую руку
    if (rezult.length == arr.length)
      return true
  }

  async delImg(id) {
    const arrayImg = []
    // Получаю объект продукта, в котором надо удалить фотки
    const findProduct = await productModel.findOne({ _id: id })
    // пушу в массив title preview
    arrayImg.push(findProduct.preview)
    // если есть превьюшки, пушу их тоже
    arrayImg.forEach(item => {
      this.delPhoto(item)
    })
    return true
  }
  async updateProduct(product) {
    const change = await productModel.findOne({ _id: product._id }).replaceOne(product);
    if (change.ok) {
      const upProduct = await productModel.findOne({ _id: product._id });
      return upProduct
    }
    else return false
  }
  async changeCategoryProduct(data) {
    const { id, newName } = data;
    const update = await productModel.updateMany({ 'category.id': id }, { $set: { 'category.name': newName } });
    if (update.ok) return true
  }

  async deleteProduct(id, name) {
    const rezultDelImg = await this.delImg(id)
    if (rezultDelImg) {
      const delProduct = await productModel.deleteOne({ _id: id, autor: name }, (e) => {
        if (!e) return true
        else {
          console.log(e)
          return false;
        }
      });
      if (delProduct) return true

    }
    else return false

  }
  async deleteProducts(data) {
    const { id, filter } = data;
    const result = await productModel.find({ [filter]: id });
    result.forEach(item => {
      if (item) this.deleteProduct(item._id, item.autor)
    })
    return true
  }

  async createProduct(req) {
    const { name, autor, shortDescription, description, price, brand, category, preview, previews, details, promotion } = req;
    const find = await productModel.findOne({ name });

    if (!find) {
      const product = {
        name,
        autor,
        shortDescription,
        description,
        price,
        brand,
        activity: true,
        date: Date.now(),
        category,
        preview,
        previews,
        details,
        promotion
      }
      const newProduct = new productModel(product)
      return await newProduct.save();
    }
    return false
  }
}



module.exports = Product;