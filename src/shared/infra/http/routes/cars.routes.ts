import { Router } from 'express';
import multer from 'multer';

import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { CreateCarSpecificationController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { UploadCarsImagesController } from '@modules/cars/useCases/uploadCarImage/UploadCarsImagesController';

import uploadConfig from '@config/upload';
import { ensureAuth } from '../middlewares/ensureAuth';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const carsImagesController = new UploadCarsImagesController();
const upload = multer(uploadConfig.upload('./tmp/cars'));

carsRoutes.post('/', ensureAuth, ensureAdmin, createCarController.handle);
carsRoutes.get('/available', listAvailableCarsController.handle);
carsRoutes.post(
  '/:id/specifications',
  ensureAuth,
  ensureAdmin,
  createCarSpecificationController.handle,
);
carsRoutes.post(
  '/:id/images',
  ensureAuth,
  ensureAdmin,
  upload.array('images'),
  carsImagesController.handle,
);

export { carsRoutes };
