const Section = require('../models/section.model');
const Instrument = require('../models/instrument.model');
const Musician = require('../models/musician.model');
const ResourceInstrument = require('../models/resourceInstrument.model');

exports.createSection = async (req, res) => {
  const newSection = {...req.body};

  try {
    const section = new Section(newSection);
    await section.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readSections = async (req, res) => {
  const options = { sort: {name: 1} };
  try {
    const sections = await Section.find().populate([
      {
        path: 'instruments', 
        model: Instrument,
        options,
      },
      {
        path: 'instructor',
        model: Musician,
        select: '-phone -email -address1 -address2 -instrument -isChild -parentName -parentPhone -isActive -joiningDate -birthDate -isStudent -isInstructor',
      }
    ]).sort({name: 1});
  
    if (!sections.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(sections);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readSectionById = async (req, res) => {
  try {
    const section = await Section.findOne({_id: req.params.id});
  
    if (!section) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(section);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.updateSection= async (req, res) => {

  try {
    let section = await Section.findOne({_id: req.params.id});
    if (section) {      
      await Section.updateOne({ _id: req.params.id }, { $set: {
        name: req.body.name ? req.body.name : section.name,
        instructor: req.body.instructor ? req.body.instructor : section.instructor
      }});

      musician = await Section.findOne({_id: req.params.id})
      res.json(musician);
    } else {
      res.status(404).json({message: 'Section not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.deleteSection = async (req, res) => {
  const otherInstrumentTypeId = '63637ff47a19c6ae2179c5cb';
  try {
    const sectionToDelete = await Section.findOne({ _id: req.params.id });
    const instrumentToDelete = await Instrument.find({section: req.params.id});
    if (sectionToDelete) {
      if (instrumentToDelete.length) {
        await Instrument.deleteMany({section: req.params.id})
        instrumentToDelete.forEach(async instrumentToDelet => {
          await ResourceInstrument.updateMany({type : instrumentToDelet.section}, {type: otherInstrumentTypeId});
        })
      }
      await Section.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Section not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}