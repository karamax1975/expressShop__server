const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const config = require('./config');

// const DBURL = 'mongodb+srv://max:German2002@cluster0.7ncft.mongodb.net/products';
app.use(bodyParser.json())
app.use("/public", express.static(__dirname + "/public"));
app.use('/api/', cookieParser(), require('./routers/api/users_routers'));
app.use('/api/', require('./routers/api/product_routers'))
app.use('/api/', require('./routers/api/category_routers'));
app.use('/api/', require('./routers/api/choice_routers'))



if (process.env._NODE == 'BUILD') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}



async function start() {

  try {
    await mongoose.connect(process.env.BDURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(5000, () => {
      console.log(`Server start ${process.env.SERVER_PORT} port`);
    })
  } catch (e) {
    console.error(e);
  }
}

start();
