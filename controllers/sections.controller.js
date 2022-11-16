const Section = require('../models/section.model');

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
  try {
    const sections = await Section.find();
  
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
  try {
    const sectionToDelete = await Section.findOne({ _id: req.params.id });
    if (sectionToDelete) {
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