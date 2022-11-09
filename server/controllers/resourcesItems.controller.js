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

exports.readResourcesInstruments = async (req, res) => {
  const sotrGroup = function(a, b) {
    const result = a.type.name.toLowerCase().localeCompare(b.type.name.toLowerCase());
    if (result !== 0) {
      return result;
    } else {
      return a.brand.toLowerCase().localeCompare(b.brand.toLowerCase())
    }
  }
  try {
    const resources = await Resource.find()
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
  
    if (!resources.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const brass = resources.filter(resource => resource.type.section.name === 'blacha');
      const woodwinds = resources.filter(resource => resource.type.section.name === 'drewno');
      const percussions = resources.filter(resource => resource.type.section.name === 'perkusja');
      const others = resources.filter(resource => resource.type.section.name === 'pozostałe');
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

exports.updateResource = async (req, res) => {
  try {
    let resource = await Resource.findOne({_id: req.params.id});
    if (resource) {      
      await Resource.updateOne({ _id: req.params.id }, { $set: {
        brand: req.body.hasOwnProperty('brand') ? req.body.brand : resource.brand,
        model: req.body.hasOwnProperty('model') ? req.body.model : resource.model,
        condition: req.body.hasOwnProperty('condition') ? req.body.condition : resource.condition,
        description: req.body.hasOwnProperty('description') ? req.body.description : resource.description,
        serialNumber: req.body.hasOwnProperty('serialNumber') ? req.body.serialNumber : resource.serialNumber,
        type: req.body.hasOwnProperty('type') ? req.body.type : resource.type,
        user: req.body.hasOwnProperty('user') ? req.body.user : resource.user,
      }});

      
      res.json({mess: 'ok'});
    } else {
      res.status(404).json({message: 'Musician not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}