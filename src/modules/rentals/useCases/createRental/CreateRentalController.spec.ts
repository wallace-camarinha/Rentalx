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

  it('Should be able to create a new car rental', async () => {
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

    const response = await request(app)
      .post('/rentals')
      .send({
        car_id: car.id,
        start_date: new Date(),
        expected_return_date: new Date(2093, 9, 7),
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
