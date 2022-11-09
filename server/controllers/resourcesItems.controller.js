const Resource = require('../models/resourceDetails.model');
const Instrument = require('../models/instrument.model');
const Section = require('../models/section.model');
const Musician = require('../models/musician.model')

exports.createResource = async (req, res) => {
  const newResource = {...req.body};

  try {
    const resource = new Resource(newResource);
    await resource.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate([
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
        path: 'user', 
        model: Musician,
        select: { 'firstName': 1,'lastName':1},
      }
      
    ]);
  
    if (!resources.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const brass = resources.filter(resource => resource.type.section.name === 'blacha');
      const woodwinds = resources.filter(resource => resource.type.section.name === 'drewno');
      const percussion = resources.filter(resource => resource.type.section.name === 'perkusja');
      const others = resources.filter(resource => resource.type.section.name === 'pozostałe');
      const DTO = {brass, woodwinds, percussion, others};
      res.json(DTO);
    }

  } catch(err) {
    console.log(err)
    res.status(500).json({ message: err });
  }
}

// exports.readSectionById = async (req, res) => {
//   try {
//     const section = await Section.findOne({_id: req.params.id});
  
//     if (!section) {
//       res.status(404).json({ message: 'not found !!'});
//     } else {
//       res.json(section);
//     }

//   } catch(err) {
//     res.status(500).json({ message: err });
//   }
// }

// exports.updateSection= async (req, res) => {

//   try {
//     let section = await Section.findOne({_id: req.params.id});
//     if (section) {      
//       await Section.updateOne({ _id: req.params.id }, { $set: {
//         name: req.body.name ? req.body.name : section.name,
//         instructor: req.body.instructor ? req.body.instructor : section.instructor
//       }});

//       musician = await Section.findOne({_id: req.params.id})
//       res.json(musician);
//     } else {
//       res.status(404).json({message: 'Section not found.'})
//     }

//   } catch(err) {
//     res.status(500).json({ message: err });
//   }
// }

exports.deleteResource = async (req, res) => {
  try {
    const resourceTODelete = await Resource.findOne({ _id: req.params.id });
    if (resourceTODelete) {
      await Resource.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Resource not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}