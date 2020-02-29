import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import FileController from './app/controllers/FileController';
<<<<<<< HEAD
import NotificationController from './app/controllers/NotificationController';
=======
>>>>>>> 0cc3d26... fix: avatar file upload

import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

<<<<<<< HEAD
routes.get('/providers', ProviderController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedules', ScheduleController.index);

routes.get('/notifications', NotificationController.index);

=======
routes.get('/schedules', ScheduleController.index);

>>>>>>> 0cc3d26... fix: avatar file upload
export default routes;
