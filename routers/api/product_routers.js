const { Router } = require('express');
const Product = require('../../essence/product/product');
const fileUpload = require('express-fileupload');
const config = require('../../config');
const path = require('path');

const router = Router();
const product = new Product()


router.post('/product_delImg', async (req, res) => {
  const rezult = await product.delPhoto(req.body.file);
  if (rezult)
    res.status(200)
})
router.post('/deleteImg', async (req, res) => {
  const rezult = await product.delArrImg(req.body.data)
  if (rezult) res.send({ status: true })
  else res.send({ status: false })
})

// -------------------------------------------------------------------------------

router.get('/getListAllProducts', async (req, res) => {
  const list = product.getListAllProducts();
  list.then(data => {
    if (data) res.send({ data })
    else res.status(400).json({ message: 'Ops...' })
  })
})

router.post('/product', fileUpload(), async (req, res) => {
  const { name, autor, category, preview } = req.body
  if (name, autor, category, preview) {
    try {
      const prod = await product.createProduct(req.body);
      if (prod) {
        res.send({ message: 'Product added', name: prod.name })
      }
      else res.status(401).json({ message: 'Product exists' })
    } catch (e) {
      console.error(e);
    }
  }

})
// ----------------------------------------------------------------------------

router.post('/createProduct', async (req, res) => {
  console.log(req.body.data);
  const newProduct = await product.createProduct(req.body.data);
  if (newProduct) res.send({ status: true, newProduct });
  else res.send({ status: false })

})

router.delete('/deleteProduct', async (req, res) => {


  const { id, user } = req.body.data
  const rezult = await product.deleteProduct(id, user);
  if (rezult) {
    res.send({ status: true })
  }
  else res.send({ status: false })

})
router.put('/updateProduct', async (req, res) => {
  // const { id, obj } = req.body.data;
  const result = await product.updateProduct(req.body.data)
  if (result) {
    res.send({ status: true, result })
  }
  else res.send({ status: false })

})

router.post('/uploadPreview', fileUpload(), async (req, res) => {

  let dirUpload = path.resolve(config.PROJECT_DIR, 'client', 'public', 'upload');
  if (process.env._NODE == 'BUILD') {
    dirUpload = path.resolve(config.PROJECT_DIR, 'client', 'build', 'upload');
  }
  if (req.files || Object.keys(req.files).length > 0) {
    // чтобы переименовать файл (не понимает русские буквы)
    const url = req.files.previewUrl.name.match('\.[A-z]{3,4}$');
    const fileName = `${req.files.previewUrl.md5}${url}`
    // --------------------------
    req.files.previewUrl.mv(`${dirUpload}/${fileName}`, (e) => {
      if (e) res.status(500).send({ status: false })
      res.send({ status: true, file: fileName })
    })
  }
  else return res.status(400).send('No files were uploaded.');

})




module.exports = router;