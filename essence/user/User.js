const bcrypt = require('bcryptjs');
const modelUser = require('../models/user')

class User {


  async setHashUserPassword(password) {
    return await bcrypt.hash(password, 12);
  }
  async verifeHashUserPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  // ---------------------------------------------------------
  async findUser(ID, password) {
    try {
      const user = await modelUser.findOne({ ID })
      const userHash = user.password;
      const rezultVerifePassword = await this.verifeHashUserPassword(password, userHash)
      if (rezultVerifePassword) return user
      else return false
    } catch (e) {
      console.log(e);
    }
  }
  // --------------------------------------------------------------------
  async createUser(ID, password) {

    try {
      const user = await modelUser.findOne({ ID })
      if (!user) {
        const hash = await this.setHashUserPassword(password);
        const newUser = new modelUser({ ID, password: hash, status: 'user' });
        return await newUser.save();
      }
      return false
    } catch (e) {
      console.log(e);
    }
    return user
  }
  // ----------------------------------------------------------------------
  async checkID(_id) {
    try {
      const user = await modelUser.findOne({ _id })
      if (user) {
        return user
      }
      else return false
    } catch (e) {
      console.log(e);
    }
  }


}

module.exports = User