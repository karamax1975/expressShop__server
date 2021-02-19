const { Router } = require('express');
const category = require('../../essence/category/category');
const bodyParser = require('body-parser');
const router = require('./product_routers');


router.get('/getCategory', async (req, res) => {
  const list = await category.getCategories();
  if (list) res.send(list)
})


router.post('/addCategory', async (req, res) => {
  try {
    const newCategory = await category.createCategory(req.body.data);
    if (newCategory) res.send({ status: true, newCategory })
    else res.send({ status: false })

  } catch (e) {
    console.error(e);
  }


})

module.exports = router