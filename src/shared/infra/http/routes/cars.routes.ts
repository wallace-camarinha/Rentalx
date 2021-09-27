import { Router } from 'express';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAuth } from '../middlewares/ensureAuth';

const carsRoutes = Router();

const createCarController = new CreateCarController();

carsRoutes.post('/', ensureAuth, ensureAdmin, createCarController.handle);

export { carsRoutes };
