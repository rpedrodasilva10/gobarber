import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const users = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (users.length == 0) {
      return res.status(404).json({ message: 'No providers to show' });
    }

    return res.json({ providers: users });
  }
}

export default new ProviderController();
