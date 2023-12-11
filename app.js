require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const musiciansRoutes = require('./routes/musicians.routes');
const sectionsRoutes = require('./routes/sections.routes');
const instrumentsRoutes = require('./routes/instruments.routes');
const resourcesInstrumentRoutes = require('./routes/resourcesInstruments.routes');
const presenceRoutes = require('./routes/presence.routes');
const contributionsRoutes = require('./routes/contributions.routes');
const eventsRoutes = require('./routes/events.routes');
const accountingRoutes = require('./routes/accounting.routes');

const app = express();

app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public/client')));
app.use((req,res,next) => {
  if (
    req.originalUrl === "/api/user/login"
    || !req.originalUrl.includes('api')
  ) {
    next();
    return 
  }

  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
})

const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {console.log('Databse connected.')});
db.once('error', () => {console.log('error')});

app.use('/api', musiciansRoutes);
app.use('/api', sectionsRoutes);
app.use('/api', instrumentsRoutes);
app.use('/api', resourcesInstrumentRoutes);
app.use('/api', presenceRoutes);
app.use('/api', contributionsRoutes);
app.use('/api', eventsRoutes);
app.use('/api', accountingRoutes);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})