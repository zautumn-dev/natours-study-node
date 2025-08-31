const fsPromises = require('node:fs/promises');

const dotenv = require('dotenv');

dotenv.config({
  path: ['.env', 'config.env'],
});

const { setTours } = require('./controller/tours');

const port = process.env.PORT || 1000;

const app = require('./app');

app.listen(port, async (_) => {
  try {
    // TODO read file simple tours list
    setTours(
      JSON.parse(await fsPromises.readFile(`${__dirname}/dev-data/data/tours-simple.json`, { encoding: 'utf8' })),
    );

    console.log(`app is running on: http://localhost:${port}`);
  } catch (e) {
    console.log(e);
  }
});
