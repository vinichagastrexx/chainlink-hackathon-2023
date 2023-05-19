import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper';
import env from './config/env';
import app from './config/app';

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    const PORT = env.port;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(console.error);
