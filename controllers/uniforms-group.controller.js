const UniformsGroup = require('../models/uniform-group.model');
const UniformItem = require('../models/uniform-item.model');

exports.readGroups = async (req, res) => {
  try {
    const groups = await UniformsGroup.find().populate({
      path: 'parts', 
      model: UniformItem,
    }).sort({name: 1});
   
  
    if (!groups.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(groups);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readGroupParts = async (req, res) => {
  try {
    const items = await UniformItem.find({group: req.params.id}).select('-group').sort({name: 1});
  
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
  const newGroup = {...req.body, parts: []};

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

    const partsToSave = parts.map(part => {
      return {
        group: groupId,
        name: part.name,
        state: part.amount
      }
    });

    UniformItem.insertMany(partsToSave).then(async (newParts) => {
      await UniformsGroup.findById(groupId).exec(async (err, data) => {
        const dataParts = data && data.parts && data.parts.length ? data.parts : [];
        const newPartsIds = newParts.map(part => part._id);
        await UniformsGroup.updateOne({_id: groupId}, {$set: {
            parts: dataParts.concat(newPartsIds)
          }}).exec(() => res.json('OK'));
        });
    })
    
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.removePart = async (req, res) => {
  try {
    const partToDelete = await UniformItem.findOne({ _id: req.params.id });
    if (partToDelete) {
      await UniformItem.deleteOne({ _id: req.params.id }).then(async () => {
        await UniformsGroup.findById(req.body.groupId).exec(async (err,data) => {
          const items = data.parts.map(part => part.valueOf());
          const index = items.indexOf(req.params.id);
         if (index >= 0) {
          items.splice(index, 1);
          await UniformsGroup.updateOne({_id: data._id}, {$set: {
            parts: items
          }}).then(() => res.json({ message: 'OK' }))
         }
        })
      });
    } else {
      res.status(404).json({message: 'Uniforms part not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.editPart = async (req, res) => {
  try {
    let part = await UniformItem.findOne({_id: req.params.id});
    if (part) {      
      await UniformItem.updateOne({ _id: req.params.id }, { $set: {
        name: req.body.hasOwnProperty('name') ? req.body.name : part.name,
        state: req.body.hasOwnProperty('state') ? req.body.state : part.state,
      }});
      res.json({mess: 'ok'});
    } else {
      res.status(404).json({message: 'Unfirm part not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.assignMemberToPart = async (req, res) => {
  try {
    const memberId = req.body.memberId;
    const parts = req.body.parts;
    parts.forEach( async (part) => {
      const partToEdit = await UniformItem.findById(part.id);
      const index = partToEdit.usingMembers.indexOf(memberId);
      if (partToEdit && part.assigned && index < 0) {
        await UniformItem.updateOne({_id: partToEdit._id}, {$set: {
          usingMembers: partToEdit.usingMembers.concat(memberId)
        }})
      } else if (partToEdit && !part.assigned && index >= 0) {
        partToEdit.usingMembers.splice(index, 1);
        await UniformItem.updateOne({_id: partToEdit._id}, {$set: {
          usingMembers: partToEdit.usingMembers
        }})
      }
    })
    res.json({mess: 'ok'});
  } catch(err) {
    res.status(500).json({ message: err });
  }
}
