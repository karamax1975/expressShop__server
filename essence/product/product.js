const productModel = require('../models/product');
const categoryModel = require('../models/category');
const path = require('path');
const config = require('../../config')
const fs = require('fs')


class Product {




  async findTemplate(userId) {

    const templateProduct = {
      name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ligula nunc aliquet maecenas tellus placerat purus.',
      shortDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nec curabitur euismod et, elementum congue enim commodo mattis et. Commodo morbi amet, lacinia dignissim lacus. Ligula nunc aliquet maecenas tellus placerat purus suspendisse.',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque faucibus ante dictumst tellus tempus faucibus habitasse viverra placerat. Et semper adipiscing at eget at. Fusce nulla hac nunc felis, libero eget lectus imperdiet pellentesque. Nibh morbi ut phasellus id dictum consequat, gravida. Eget sit sed eros, sed quis arcu, aliquam. Nec netus metus sem tellus sit ipsum. Tortor, lobortis pellentesque mattis nibh pharetra, ut. Facilisis in cursus morbi eu. Massa ultrices dui aenean vivamus cursus erat. Sed rhoncus, nisl adipiscing urna odio viverra ac nibh. Vel adipiscing magna natoque aliquam aliquam cras sapien, aliquam elit. Quam sit urna, a egestas. Sit nisi, sapien, aliquam cursus lectus. Elementum at augue enim lorem tristique dignissim varius libero. Velit sit ipsum nunc, odio elit auctor eleifend tincidunt nunc. Sit suspendisse varius id pellentesque eget eu. Malesuada rhoncus mi tincidunt hac justo. Mauris sed dictum tincidunt euismod vulputate mauris, mauris. Mattis ut neque tempus, posuere nunc. Sit libero purus nec vel orci, lacus. Habitasse sit elementum arcu sed. Quam rhoncus enim porttitor in laoreet ullamcorper malesuada arcu. Platea viverra gravida auctor aliquam sed leo at nec, iaculis. Arcu at lacinia varius phasellus sapien.',
      prise: 999.99,
      date: Date.now(),
      brand: 'Samsung',
      activity: true,
      autor: userId,
      details: [{ name: 'Name:', description: 'Description:' }],
      // category: 'Template',
      category: { id: '5ff8bf24e349a00508da152e', name: 'Template' },
      preview: 'previewImg.svg',
      previews: ['previewsImg.svg'],
    }


    const find = await productModel.findOne({ name: templateProduct.name });
    if (!find) {
      const newProduct = new productModel(templateProduct);
      const template = await newProduct.save();
      return {
        template,
        findTemplate: false
      }
    }
    else return {
      find,
      findTemplate: true
    }
  }
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
    if (change.ok) return true
    else return false
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