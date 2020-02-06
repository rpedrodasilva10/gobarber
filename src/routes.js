import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get(
  '/',
  async (req, res) => {
    console.log('--------------------------------- T E S T E  ');
    /*name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING, */
    const user = await User.create({
      name: 'Renan',
      email: 'rpedrodasilva10@gmail.com',
      password_hash: '12313131',
    });
    return res.json(user);
  },
  err => console.error(err)
);

export default routes;
