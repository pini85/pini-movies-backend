const verifyGoogleToken = require('../services/verifyGoogleToken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const SavedMovies = require('../models/SavedMovies');
const jwt = require('jsonwebtoken');
module.exports = (app) => {
  app.post('/api/auth/google/login', async (req, res) => {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
        let userDoc;
        const profile = verificationResponse?.payload;

        userDoc = await User.findOne({ email: profile?.email });

        if (!userDoc) {
          const user = new User({
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            credit: 2,
          });
          userDoc = await user.save();
        }

        const token = jwt.sign({ userId: userDoc._id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        res.json({
          message: 'Login was successful',
          user: {
            ...userDoc._doc,
          },
          token,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error?.message || error,
      });
    }
  });
  //get current user
  app.get('/api/auth/current_user', auth, async (req, res) => {
    const userId = req.userId;
    const data = await User.findById(userId);
    res.send(data);
  });
};
