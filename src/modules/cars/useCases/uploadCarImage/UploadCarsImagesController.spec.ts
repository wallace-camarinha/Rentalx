import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '@shared/infra/http/app';
import path from 'path';

import createConnection from '@shared/infra/typeorm';

const filePath = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  '..',
  'tmp/cars/img.jpg',
);

let connection: Connection;

describe('Upload Car Image Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    connection.query(`
    INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
      values('${id}', 'admin', 'admin@rentx.com', '${password}', 'true', 'now()', 'XXXXXXXXX')
  `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
  });

  it('Should be able to upload an image to a car', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });
    const { token } = responseToken.body;

    const carResponse = await request(app)
      .post('/cars')
      .send({
        name: 'Test Car',
        description: 'Test Car',
        brand: 'Test Brand',
        daily_rate: 100,
        fine_amount: 50,
        license_plate: 'TEST03',
      })
      .set('Authorization', `Bearer ${token}`);
    const car = carResponse.body;

    const response = await request(app)
      .post(`/cars/${car.id}/images`)
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${token}`)
      .attach('images', filePath);

    expect(response.status).toBe(201);
  });
});
