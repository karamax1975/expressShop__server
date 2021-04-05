const { Router } = require('express');
const Catalog = require('../../essence/catalog/catalog');
const Product = require('../../essence/product/product');
const router = Router();
const catalog = new Catalog();
const product = new Product();

router.post('/createCatalogItem', async (req, res) => {
  const { data } = req.body;
  const result = await catalog.createPosition(data);
  if (result) res.send({ status: true, result })
})
router.get('/getCatalogList', async (req, res) => {
  const result = await catalog.getCatalogList();
  res.send({ status: true, result })
})
router.put('/renameCatalogItem', async (req, res) => {
  const { data } = req.body;
  const result = await catalog.renamePosition(data);
  if (result) {
    // ели есть продукты в изменяемой директории, то поменять в них поле categories.name
    const updateProduct = await product.changeCategoryProduct(data);
    if (updateProduct) res.send({ status: true })
  }
  else res.send({ status: false })
})
router.post('/delCatalogItem', async (req, res) => {
  const { data } = req.body;
  const result = await catalog.delPosition(data);
  if (result) {
    // если в директории есть продукты, они удаляются
    const delProducts = await product.deleteProducts({ id: data.id, filter: 'category.id' });
    if (delProducts)
      res.send({ status: true, result: 'Hi' })
  }
})


module.exports = router;