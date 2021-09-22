import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';

import './database';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(router);

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('Server running on port 3333!'));
