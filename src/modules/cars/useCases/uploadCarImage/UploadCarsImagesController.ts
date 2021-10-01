import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { UploadCarsImagesUseCase } from './UploadCarsImagesUseCase';

interface IFiles {
  filename: string;
}

class UploadCarsImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const images = request.files as IFiles[];

    const uploadCarsImagesUseCase = container.resolve(UploadCarsImagesUseCase);
    const fileNames = images.map(file => file.filename);

    await uploadCarsImagesUseCase.execute({
      car_id: id,
      images_name: fileNames,
    });

    return response.status(201).send();
  }
}

export { UploadCarsImagesController };
