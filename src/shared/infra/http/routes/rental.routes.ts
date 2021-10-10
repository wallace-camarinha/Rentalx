import { Router } from 'express';

import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController';
import { RentalReturnController } from '@modules/rentals/useCases/rentalReturn/RentalReturnController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';

import { ensureAuth } from '../middlewares/ensureAuth';

const createRentalController = new CreateRentalController();
const rentalReturnController = new RentalReturnController();
const listRentalsByUserController = new ListRentalsByUserController();

const rentalRoutes = Router();

rentalRoutes.post('/', ensureAuth, createRentalController.handle);
rentalRoutes.post('/return/:id', ensureAuth, rentalReturnController.handle);
rentalRoutes.get('/user/', ensureAuth, listRentalsByUserController.handle);

export { rentalRoutes };
