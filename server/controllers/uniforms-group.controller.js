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
      await UniformItem.deleteMany({group: req.params.id});
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Uniforms group not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.editGroup = async (req, res) => {
  try {
    let group = await UniformsGroup.findOne({_id: req.params.id});
    if (group) {      
      await UniformsGroup.updateOne({ _id: req.params.id }, { $set: {
        name: req.body.hasOwnProperty('name') ? req.body.name : group.name
      }});
      res.json({mess: 'ok'});
    } else {
      res.status(404).json({message: 'Unfirm group not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.addParts = async (req, res) => {
  const groupId = req.body.groupId;
  const parts = req.body.parts;

  try {
    parts.forEach(async (part) => {
      const newPart = new UniformItem({
        group: groupId,
        name: part.name,
        state: part.amount
      });
      await newPart.save();
    });

    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.removePart = async (req, res) => {
  try {
    const partToDelete = await UniformItem.findOne({ _id: req.params.id });
    if (partToDelete) {
      await UniformItem.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Uniforms part not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}



