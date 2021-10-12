import createConnection from '@shared/infra/typeorm';
import { app } from './app';

createConnection();
// eslint-disable-next-line no-console
app.listen(3333, () => console.log('Server running on port 3333!'));
