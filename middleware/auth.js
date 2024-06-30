const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'tokenExpired' });
    }
    if (err) {
      console.log({ err });
      return res.sendStatus(403);
    }
    const { userId } = user;

    req.userId = userId;

    next();
  });
};

//check if the user is auth
//if yes go to next
//if not throw an error
