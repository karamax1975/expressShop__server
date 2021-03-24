const { Router } = require('express');
const Catalog = require('../../essence/catalog/catalog');
const router = Router();
const catalog = new Catalog();

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
  if (result) res.send({ status: true })
  else res.send({ status: false })
})
router.post('/delCatalogItem', async (req, res) => {
  const { data } = req.body;
  const result = await catalog.delPosition(data)
  if (result) res.send({ status: true, result: 'Hi' })
})


module.exports = router;