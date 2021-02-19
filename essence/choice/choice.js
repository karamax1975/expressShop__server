const choice = require('../models/choice')
const choiceModel = require('../models/choice')

class Choice {
  async getChoice() {
    const listChoice = await choiceModel.find();
    return listChoice;
  }
}

module.exports = Choice