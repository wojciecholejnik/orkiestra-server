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
    let mappedResourcesInstruments;
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
      
    ]).then(items => {
      mappedResourcesInstruments = items.map(instrument => {
        if (instrument.type && instrument.type.section) {
          return instrument
        } else {
          const mockedInstrument = {
            ...instrument._doc,
            type: {
              _id: '636b4f23d34006f259541a74',
              name: 'pozostałe',
              section: {
                name: 'pozostałe',
                _id: '63637ff47a19c6ae2179c5cb'
              }
            }}
          return mockedInstrument
        }
      })
    });
  
    if (!mappedResourcesInstruments.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const sectionsNames = [];
      mappedResourcesInstruments.forEach(instrument => {
        if (instrument.type && sectionsNames.indexOf(instrument.type.section.name) < 0) {
          sectionsNames.push(instrument.type.section.name)
        } else if (!instrument.type && sectionsNames.indexOf('pozostałe') < 0) {
          sectionsNames.push('pozostałe')
        }
      });
      sectionsNames.sort();
      
      const sections = sectionsNames.map(sectionName => {
        
        const sectionToSend = {
          name: sectionName,
          instruments: mappedResourcesInstruments.filter(resourceInstrument => resourceInstrument.type.section.name === sectionName)
        }
        sectionToSend.instruments.sort((a,b) => sotrGroup(a,b));
        return sectionToSend
      })
      res.json(sections)
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