const ResourceInstrument = require('../models/resourceInstrument.model');
const Instrument = require('../models/instrument.model');
const Section = require('../models/section.model');
const Musician = require('../models/musician.model')

exports.createResourceInstrument = async (req, res) => {
  const newResourceInstrument = {...req.body};

  try {
    const resourceInstrument = new ResourceInstrument(newResourceInstrument);
    await resourceInstrument.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readResourceInstruments = async (req, res) => {
  const sotrGroup = function(a, b) {
    const result = a.type.name.toLowerCase().localeCompare(b.type.name.toLowerCase());
    if (result !== 0) {
      return result;
    } else {
      return a.brand.toLowerCase().localeCompare(b.brand.toLowerCase())
    }
  }
  try {
    const resourceInstruments = await ResourceInstrument.find()
    .populate([
      {
        path: 'type', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
          select: { 'name': 1,},
        }
      },
      {
        model: Musician,
        'path': 'user',
        'match': { 'user': {'$ne': ''} }
      }
      
    ]);
  
    if (!resourceInstruments.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const brass = resourceInstruments.filter(resourceInstrument => resourceInstrument.type.section.name === 'blacha');
      const woodwinds = resourceInstruments.filter(resourceInstrument => resourceInstrument.type.section.name === 'drewno');
      const percussions = resourceInstruments.filter(resourceInstrument => resourceInstrument.type.section.name === 'perkusja');
      const others = resourceInstruments.filter(resourceInstrument => resourceInstrument.type.section.name === 'pozostałe');
      brass.sort((a,b) => sotrGroup(a,b));
      woodwinds.sort((a,b) => sotrGroup(a,b));
      percussions.sort((a,b) => sotrGroup(a,b));
      others.sort((a,b) => sotrGroup(a,b));
      const DTO = {brass, woodwinds, percussions, others};
      res.json(DTO);
    }

  } catch(err) {
    console.log(err)
    res.status(500).json({ message: err });
  }
}

exports.deleteResourceInstrument = async (req, res) => {
  try {
    const resourceInstrumentTODelete = await ResourceInstrument.findOne({ _id: req.params.id });
    if (resourceInstrumentTODelete) {
      await ResourceInstrument.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'ResourceInstrument not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.updateResourceInstrument = async (req, res) => {
  try {
    let resourceInstrument = await ResourceInstrument.findOne({_id: req.params.id});
    if (resourceInstrument) {      
      await ResourceInstrument.updateOne({ _id: req.params.id }, { $set: {
        brand: req.body.hasOwnProperty('brand') ? req.body.brand : resourceInstrument.brand,
        model: req.body.hasOwnProperty('model') ? req.body.model : resourceInstrument.model,
        condition: req.body.hasOwnProperty('condition') ? req.body.condition : resourceInstrument.condition,
        description: req.body.hasOwnProperty('description') ? req.body.description : resourceInstrument.description,
        serialNumber: req.body.hasOwnProperty('serialNumber') ? req.body.serialNumber : resourceInstrument.serialNumber,
        type: req.body.hasOwnProperty('type') ? req.body.type : resourceInstrument.type,
        user: req.body.hasOwnProperty('user') ? req.body.user : resourceInstrument.user,
      }});

      
      res.json({mess: 'ok'});
    } else {
      res.status(404).json({message: 'Musician not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}