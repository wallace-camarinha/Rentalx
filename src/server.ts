import express from 'express';

import { categoriesRoutes } from './routes/categories.routes';
import { specificationsRoutes } from './routes/specifications.routes';

const app = express();

app.use(express.json());

app.use('/categories', categoriesRoutes);
app.use('/specifications', specificationsRoutes);

// eslint-disable-next-line no-console
app.listen(3333, () => console.log('Server running on port 3333!'));
