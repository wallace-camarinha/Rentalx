import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { RentalReturnController } from '@modules/rentals/useCases/rentalReturn/RentalReturnController';

import { ensureAuth } from '../middlewares/ensureAuth';

const createRentalController = new CreateRentalController();
const rentalReturnController = new RentalReturnController();

const rentalRoutes = Router();

rentalRoutes.post('/', ensureAuth, createRentalController.handle);
rentalRoutes.post('/return/:id', ensureAuth, rentalReturnController.handle);

export { rentalRoutes };
