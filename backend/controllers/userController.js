const userModel = require('../models/userModel');

const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findUserByEmail(req.user.email); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile };