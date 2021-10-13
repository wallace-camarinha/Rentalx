import { CarImage } from '../infra/typeorm/entities/CarImage';

interface ICarsImagesRepository {
  create(car_id: string, image_name: string): Promise<CarImage>;
  findAllByCarId(carId: string): Promise<CarImage[]>;
}

export { ICarsImagesRepository };
