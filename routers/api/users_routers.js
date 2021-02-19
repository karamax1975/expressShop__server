const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../essence/user/User')


const user = new User();
const router = Router();

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}




// ---------------------------------------------------------
router.post('/auth', async (req, res) => {
  const { ID, password } = req.body;
  const valideID = await validateEmail(ID);
  if (valideID) {
    if (ID, password && password > 6) {
      const authUser = await user.findUser(ID, password);
      if (authUser) {
        const token = await jwt.sign({ userId: authUser._id }, process.env.SECRET, { expiresIn: '24h' })
        if (token) {
          res.status(200).json({ message: 'OK', statusUser: authUser.status, token });
        }

      }
      else {
        res.status(401).json({
          message: 'User exists'
        }, 1000)
      }
    }
  }

  else res.status(400).json({ message: 'Ops' })
})

// --------------------------------------------------------------------
router.post('/registration', async (req, res) => {

  const { ID, password } = req.body;

  if (password.length > 6 && validateEmail(ID)) {
    user.createUser(ID, password).then((user) => {
      if (user) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '24h' })
        res.json({ message: 'OK', redirect: user.status, token });
      }
      else res.status(401).json({ message: 'User exists' })
    });
  }
  else res.status(400).json({ message: 'Form not valid' })
})
// -----------------------------------------------------------------------
router.post('/login', async (req, res) => {
  if (process.env.SECRET) {
    const verifyToken = await jwt.verify(req.cookies.name, process.env.SECRET);
    if (verifyToken) {
      const { userId } = verifyToken;
      const check = await user.checkID(userId);
      if (check) {
        res.json({ id: check._id, status: check.status })
      }
      else res.json({ id: null, status: null })
    }

  }


})

module.exports = router;
