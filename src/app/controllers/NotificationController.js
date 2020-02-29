import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const providerId = req.userId;

    const isProvider = await User.findOne({
      where: {
        id: providerId,
        provider: true,
      },
    });

    if (!isProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }
    const notifications = await Notification.find(
      {
        user: providerId,
        read: false,
      },
      'content createdAt'
    ).sort({ createdAt: 'desc' });

    console.log(notifications);
    return res.status(200).json(notifications);
  }
}

export default new NotificationController();
