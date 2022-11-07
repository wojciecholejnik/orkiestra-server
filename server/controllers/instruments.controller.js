const Instrument = require('../models/instrument.model');

exports.createInstrument = async (req, res) => {
  const newInstrument = {...req.body};

  try {
    const instrument = new Instrument(newInstrument);
    await instrument.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readInstruments = async (req, res) => {
  try {
    const instruments = await Instrument.find();
  
    if (!instruments.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(instruments);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readInstrumentById = async (req, res) => {
  try {
    const instrument = await Instrument.findOne({_id: req.params.id});
  
    if (!instrument) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(instrument);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.updateInstrument = async (req, res) => {
  try {
    let instrument = await Instrument.findOne({_id: req.params.id});
    if (instrument) {      
      await Instrument.updateOne({ _id: req.params.id }, { $set: {
        name: req.body.name ? req.body.name : section.name,
        section: req.body.section ? req.body.section : instrument.section
      }});

      instrument = await Instrument.findOne({_id: req.params.id});
      res.json(instrument);
    } else {
      res.status(404).json({message: 'Instrument not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.deleteInstrument = async (req, res) => {
  try {
    const instrumentToDelete = await Instrument.findOne({ _id: req.params.id });
    if (instrumentToDelete) {
      await Instrument.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Instrument not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}