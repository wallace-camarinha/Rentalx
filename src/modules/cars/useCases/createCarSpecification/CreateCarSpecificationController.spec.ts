import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
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

  it('Should be able to create a new car specification', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });
    const { token } = responseToken.body;

    const responseCar = await request(app)
      .post('/cars')
      .send({
        name: 'Create Car Test',
        description: 'Create Car Test',
        brand: 'Test Brand',
        daily_rate: 100,
        fine_amount: 50,
        license_plate: 'TEST01',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const car = responseCar.body;

    const specificationResponse = await request(app)
      .post('/specifications')
      .send({
        name: 'Specification Test',
        description: 'Specification Test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const specification = specificationResponse.body;

    const response = await request(app)
      .post(`/cars/${car.id}/specifications`)
      .send({
        specifications_ids: [specification.id],
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.specifications.length).toBe(1);
  });
});
