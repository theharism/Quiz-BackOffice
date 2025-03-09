const express = require('express');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const db = require("./config/db");
const logger = require('./services/logger');
const routes = require('./routes');
const swagger = require('./config/swagger-ui');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const path = require('path');
const cors = require('cors');

const app = express();

db();
swagger(app);

app.use(cors({
  origin: 'http://localhost:3005',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(loggingMiddleware);

app.use('/api/v1', routes);

const uploads = path.join(__dirname, './uploads');

app.use('/uploads', express.static(uploads));

if (keys.env === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(keys.port, () => {
  logger.info(logger.logTypes.SERVER,{message:`Server is running on port ${keys.port} - ${keys.env} Level`});
});
