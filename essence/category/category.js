const categoryModel = require('../models/category');

class Category {

  getCategories = async () => {
    const categories = await categoryModel.find({ name: { $ne: "Template" } });
    return categories;
  }

  createCategory = async (req) => {
    try {

      const findCategory = await categoryModel.findOne({ name: req });

      if (!findCategory) {
        const newCategory = new categoryModel({ name: req });
        return await newCategory.save()
      }
      return false
    }
    catch (e) {
      console.error(e);
    }
  }
}

module.exports = category = new Category();