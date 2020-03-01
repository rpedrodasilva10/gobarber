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

  async update(req, res) {
    const notification_id = req.params.id;

    const notification = await Notification.findByIdAndUpdate(
      notification_id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
