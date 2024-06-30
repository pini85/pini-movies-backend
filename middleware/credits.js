const User = require('../models/User');
const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
  const userId = req.userId;

  const findUser = await User.findById(userId);
  if (!findUser) return res.status(403).json({ message: 'User not found' });
  if (findUser.credit <= 0)
    return res.status(403).json({ message: 'Not enough credits' });
  req.user = findUser;
  next();
};
