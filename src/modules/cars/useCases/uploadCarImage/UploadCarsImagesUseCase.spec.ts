import { CarsImagesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsImagesRepositoryInMemory';
import { UploadCarsImagesUseCase } from './UploadCarsImagesUseCase';

let carsImagesRepository: CarsImagesRepositoryInMemory;
let uploadCarsImagesUseCase: UploadCarsImagesUseCase;

describe('Update User Avatar', () => {
  beforeEach(() => {
    carsImagesRepository = new CarsImagesRepositoryInMemory();
    uploadCarsImagesUseCase = new UploadCarsImagesUseCase(carsImagesRepository);
  });

  it("Should be able to update the user's avatar", async () => {
    const car = {
      id: 'test_car_id',
      name: 'Test Car',
      description: 'Test Car',
      daily_rate: 100,
      available: true,
      license_plate: 'TEST04',
      fine_amount: 50,
    };
    await uploadCarsImagesUseCase.execute({
      car_id: car.id,
      images_name: ['test_image', 'test_image2'],
    });

    const carImages = await carsImagesRepository.findAllByCarId(car.id);

    expect(carImages[0]).toHaveProperty('id');
    expect(carImages[0].image_name).toBe('test_image');
    expect(carImages[1].image_name).toBe('test_image2');
    expect(carImages.length).toBe(2);
  });
});
