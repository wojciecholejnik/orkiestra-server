const UniformsGroup = require('../models/uniform-group.model');
const UniformItem = require('../models/uniform-item.model');

exports.readGroups = async (req, res) => {
  try {
    const groups = await UniformsGroup.find();
   
  
    if (!groups.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      // const groups = instruments.sort((a, b) => a.name.localeCompare(b.name));
      res.json(groups);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readGroupParts = async (req, res) => {
  try {
    const items = await UniformItem.find({group: req.params.id}).select('-group');
  
    if (!items.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(items);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.createGroup = async (req, res) => {
  const newGroup = {...req.body};

  try {
    const group = new UniformsGroup(newGroup);
    await group.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.removeGroup = async (req, res) => {
  try {
    const groupToDelete = await UniformsGroup.findOne({ _id: req.params.id });
    if (groupToDelete) {
      await UniformsGroup.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Uniforms group not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

