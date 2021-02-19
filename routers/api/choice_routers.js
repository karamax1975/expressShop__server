const { Router } = require('express');
const Choice = require('../../essence/choice/choice');

const choice = new Choice;

const router = Router();

// console.log(choice.getChoice);

router.get('/getChoice', async (req, res) => {
  const rezult = await choice.getChoice();
  if (rezult) {
    res.status(200).json(rezult);
  }
  else res.status(400)
})

module.exports = router;