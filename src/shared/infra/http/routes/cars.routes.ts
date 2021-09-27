import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';

import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuth } from '../middlewares/ensureAuth';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRoutes.post('/', ensureAuth, ensureAdmin, createCarController.handle);
carsRoutes.get('/available', listAvailableCarsController.handle);

export { carsRoutes };
