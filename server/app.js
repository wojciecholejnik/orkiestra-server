const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const musiciansRoutes = require('./routes/musicians.routes');
const sectionsRoutes = require('./routes/sections.routes');
const instrumentsRoutes = require('./routes/instruments.routes');
const resourcesRoutes = require('./routes/resources.routes');


const app = express();
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


const dbURI = `mongodb+srv://wwwojtasss:wwwojtasss@cluster0.bpoyn.mongodb.net/orkiestra`;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {});
db.once('error', () => {console.log('error')});


app.use('/api', musiciansRoutes);
app.use('/api', sectionsRoutes);
app.use('/api', instrumentsRoutes);
app.use('/api', resourcesRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})