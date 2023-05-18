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
const contributionsRoutes = require('./routes/contributions.routes ');
const eventsRoutes = require('./routes/events.routes ');

const app = express();
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './public/client')));


const dbURI = `mongodb+srv://chamonix-app:chamonix-app@cluster0.bpoyn.mongodb.net/orkiestra`;
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/client/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})