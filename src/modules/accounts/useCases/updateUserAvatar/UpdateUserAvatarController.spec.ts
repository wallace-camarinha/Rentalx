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
  'tmp/avatar/img.jpg',
);

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

  it("Should be able to update the user's avatar", async () => {
    const responseToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com',
      password: 'admin',
    });

    const { token } = responseToken.body;

    const response = await request(app)
      .patch('/users/avatar')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', filePath);

    expect(response.status).toBe(204);
  });
});
