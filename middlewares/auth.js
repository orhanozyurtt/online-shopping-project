import User from '../db/models/user.js';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const decodedData = jwt.verify(token, 'SECRETOKEN');
  if (!decodedData) {
    return res.status(401).json({ message: 'Invalid token provided' });
  }
  req.user = await User.findById(decodedData.id);
  next();
};
// role check
export { authMiddleware };
