const express = require('express');
const pino = require('pino');

const app = express();
const port = 5000;

// setup logger
const logger = pino();

// for accessing json data
app.use(express.json());

// basic test route
app.get('/', (req, res) => {
  logger.info('home route was called');
  res.send('Notes app backend is running...');
});

// starting server
app.listen(port, () => {
  logger.info(`server is on and now running on port ${port}`);
});