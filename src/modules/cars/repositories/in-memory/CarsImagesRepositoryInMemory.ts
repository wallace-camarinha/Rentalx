import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarsImagesRepository } from '../ICarsImagesRepository';

class CarsImagesRepositoryInMemory implements ICarsImagesRepository {
  private carImages: CarImage[] = [];

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      car_id,
      image_name,
    });

    this.carImages.push(carImage);

    return carImage;
  }

  async findAllByCarId(carId: string): Promise<CarImage[]> {
    const foundImages = this.carImages.filter(image => image.car_id === carId);
    return foundImages;
  }
}

export { CarsImagesRepositoryInMemory };
