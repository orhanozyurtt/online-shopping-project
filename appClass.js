import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// myfiles
// db bağlantı işlemleri ve otomatik router işlemleri tanımlandı
import config from './config/index.js';
import router from './routes/index.js';
import Database from './db/DataBase.js';

class AppClass {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.PORT = config.PORT;
    this.connectDatabase();
    this.init();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(cors());
  }

  routes() {
    this.server.use('/api', router);
  }
  async connectDatabase() {
    try {
      const db = new Database();
      await db.connect(config);
      console.log('db connect !');
    } catch (error) {
      console.error('connect error', error);
    }
  }

  init() {
    this.server.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

export default new AppClass().server;
