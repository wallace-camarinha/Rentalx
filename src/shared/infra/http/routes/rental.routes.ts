import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { ensureAuth } from '../middlewares/ensureAuth';

const createRentalController = new CreateRentalController();

const rentalRoutes = Router();

rentalRoutes.post('/', ensureAuth, createRentalController.handle);

export { rentalRoutes };
