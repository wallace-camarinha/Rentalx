import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hash } from 'bcryptjs';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('List Available Cars Controller', () => {
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

  it('Should be able to list all available cars', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });
    const { token } = responseToken.body;

    const car = await request(app)
      .post('/cars')
      .send({
        name: 'Test Car',
        description: 'Test Car',
        brand: 'Test Brand',
        daily_rate: 100,
        fine_amount: 50,
        license_plate: 'TEST02',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/cars/available').send();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
