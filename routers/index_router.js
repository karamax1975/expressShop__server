const { Router } = require('express');
const mongoose = require('mongoose');


const router = Router();


router.get('/', async (req, res) => {
  res.render('index', {
    title: 'Index page'
  })
})


module.exports = router;
