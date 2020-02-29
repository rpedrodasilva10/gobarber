import User from '../models/User';
import Appointment from '../models/Appointment';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'Sequelize';

class ScheduleController {
  async index(req, res) {
    const userIsProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!userIsProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const scheduledAppointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: {
        model: User,
        as: 'user',
        attributes: ['name', 'email'],
      },
      attributes: ['date', 'id'],
      order: ['date'],
    });

    if (scheduledAppointments.length === 0) {
      return res
        .status(200)
        .json({ message: `No appointments scheduled on ${parsedDate}` });
    }
    return res.status(200).json(scheduledAppointments);
  }
}

export default new ScheduleController();
