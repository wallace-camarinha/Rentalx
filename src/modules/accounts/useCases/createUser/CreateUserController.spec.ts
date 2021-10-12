import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Hester Estrada',
      email: 'kima@zatkabram.bb',
      password: '123',
      driver_license: '02620232',
    });

    expect(response.status).toBe(201);
  });
});
