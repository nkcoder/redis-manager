const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require('body-parser');

const FRONTEND_URL = "http://localhost:3000"

const app = express();
app.use(morgan('dev'));
app.use(cors(FRONTEND_URL));
app.use(routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(4000, () => {
  console.log('listen on PORT 40000');
});

