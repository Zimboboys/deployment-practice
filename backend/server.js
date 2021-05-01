const express = require('express');
const ejwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const routes = require('./routes');

const app = express();

const secret = 'JWT_SECRET_KEY_HERE';
const ejwt_options = { secret, algorithms: ['sha1', 'RS256', 'HS256'] };

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log('connected to DB'))
.catch((e) => console.error(e));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use('/', routes);

app.post('/auth', (req, res) => {
  const token = jsonwebtoken.sign({ foo: 'bar' }, secret);
  res.send(token);
});

app.get('/protected', ejwt(ejwt_options), (req, res) => {
  res.json(req.user);
});

if (process.argv.includes('dev')) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

module.exports = app;
