import User from '../models/User';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;
    const user = await User.findByPk(req.userId);

    req.userName = user.name;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
