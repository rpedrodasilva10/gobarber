import * as Yup from 'yup';
import Appointment from '../models/Appointment';
import User from '../models/User';
import Notification from '../schemas/Notification';
import File from '../models/File';

import Mail from '../../lib/Mail';

import {
  startOfHour,
  parseISO,
  isBefore,
  format,
  subHours,
  isAfter,
} from 'date-fns';
import pt from 'date-fns/locale/pt';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.string().required(),
      date: Yup.date().required(),
    });
    const { provider_id, date } = req.body;

    if (provider_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'User must be different from Provider: ' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const existAppointment = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (existAppointment) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' h:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${req.userName} para ${formattedDate}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  async index(req, res) {
    const { page } = req.query;
    const rowsToList = 20;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: rowsToList,
      offset: (page - 1) * rowsToList,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
      ],
    });

    return res.status(200).json({ appointments: appointments });
  }

  async delete(req, res) {
    const appointment_id = req.params.id;

    let appointment = await Appointment.findByPk(appointment_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });

    const { canceledAt, date } = appointment;

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: `You don't have permission to cancel this appointment`,
      });
    }

    const isCanceled = canceledAt != null;
    const canCancel = isAfter(subHours(date, 2), new Date());

    if (isCanceled) {
      return res.status(400).json({
        error: `Appointment already canceled at ${canceledAt}`,
      });
    }

    if (!canCancel) {
      return res.status(400).json({
        error: `Can only cancel until two hours before the appointment ${
          appointment.date
        }, ${new Date()}`,
      });
    }
    await appointment.update({ canceled_at: new Date() });

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Você tem um novo cancelamento',
    });
    return res.json(appointment);
  }
}

export default new AppointmentController();
