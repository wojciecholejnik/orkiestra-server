const Musician = require('../models/musician.model');
const Instrument = require('../models/instrument.model'); 
const Section = require('../models/section.model');
const ResourceInstrument = require('../models/resourceInstrument.model');
const UniformGroup = require('../models/uniform-group.model');
const UniformItem = require('../models/uniform-item.model');
const User = require('../models/user.model');

const sortByLastName = function(a, b) {
  const result = a.lastName.localeCompare(b.lastName);
  if (result === 0) {
    return a.firstName.localeCompare(b.firstName)
  } else {
    return result
  }
}

exports.createMusician = async (req, res) => {
  const newMusician = {...req.body};

  try {
    const musician = new Musician(newMusician);
    await musician.save();
    res.json({ message: 'OK' });

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readMusicians = async (req, res) => {
  try {
    const musicians = await Musician.find().populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
        }
      },
      
    ]);
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));
      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readMusicianById = async (req, res) => {
  try {
    const musician = await Musician.findOne({_id: req.params.id}).populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
          select: '-instruments -instructor'
        }
      },
      
    ]);

    const resourceInstruments = await ResourceInstrument.find({user: req.params.id}).populate({
      path: 'type', 
      model: Instrument,
      select: '-user'
    }).sort('type');
  
    if (!musician) {
      res.status(404).json({ message: 'not found !!'});
    } else {

      const DTO = {
        ...musician._doc,
        resources: {
          instruments: resourceInstruments
        }
      };  
      
      res.json(DTO);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readActiveMusicians = async (req, res) => {
  try {
    const musicians = await Musician.find({isActive: true}).populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
        }
      },
      
    ]);
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));
      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readActiveMusiciansNames = async (req, res) => {
  try {
    const musicians = await Musician.find({isActive: true}).select('firstName lastName');
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));
      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readExMusicians = async (req, res) => {
  try {
    const musicians = await Musician.find({isActive: false}).populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
        }
      },
      
    ]);
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));
      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readMainStaffMuscians = async (req, res) => {
  try {
    const musicians = await Musician.find({isActive: true, isStudent: false}).populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
        }
      },
      
    ]);
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
            const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));

      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readMainStudentsMusicians = async (req, res) => {
  try {
    const musicians = await Musician.find({isActive: true, isStudent: true}).populate([
      {
        path: 'instrument', 
        model: Instrument,
        populate: {
          path: 'section', 
          model: Section,
        }
      },
      
    ]);
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
            const sortedMusicians = musicians.sort((a, b) => sortByLastName(a, b));

      res.json(sortedMusicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.updateMusician = async (req, res) => {
  try {
    let musician = await Musician.findOne({_id: req.params.id});
    if (musician) {      
      await Musician.updateOne({ _id: req.params.id }, { $set: {
        firstName: req.body.hasOwnProperty('firstName') ? req.body.firstName : musician.firstName,
        lastName: req.body.hasOwnProperty('lastName') ? req.body.lastName : musician.lastName,
        instrument: req.body.hasOwnProperty('instrument') ? req.body.instrument : musician.instrument,
        joiningDate: req.body.hasOwnProperty('joiningDate') ? req.body.joiningDate : musician.joiningDate,
        phone: req.body.hasOwnProperty('phone') ? req.body.phone : musician.phone,
        email: req.body.hasOwnProperty('email') ? req.body.email : musician.email,
        address1: req.body.hasOwnProperty('address1') ? req.body.address1 : musician.address1,
        address2: req.body.hasOwnProperty('address2') ? req.body.address2 : musician.address2,
        isChild: req.body.hasOwnProperty('isChild') ? req.body.isChild : musician.isChild,
        parentName: req.body.hasOwnProperty('parentName') ? req.body.parentName : musician.parentName,
        parentPhone: req.body.hasOwnProperty('parentPhone') ? req.body.parentPhone : musician.parentPhone,
        isActive: req.body.hasOwnProperty('isActive') ? req.body.isActive : musician.isActive,
        isStudent: req.body.hasOwnProperty('isStudent') ? req.body.isStudent : musician.isStudent,
        birthDate: req.body.hasOwnProperty('birthDate') ? req.body.birthDate : musician.birthDate,
      }});

      musician = await Musician.findOne({_id: req.params.id}).populate([
        {
          path: 'instrument', 
          model: Instrument,
          populate: {
            path: 'section', 
            model: Section,
          }
        },
        
      ]);
      res.json(musician);
    } else {
      res.status(404).json({message: 'Musician not found.'})
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.deleteMusician = async (req, res) => {
  try {
    const musicianToDelete = await Musician.findOne({ _id: req.params.id });
    if (musicianToDelete) {
      await Musician.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    } else {
      res.status(404).json({message: 'Musician not found'})
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readMemberUniforms = async (req, res) => {
  try {
    await UniformGroup.find().populate({
      path: 'parts',
      model: UniformItem,
      select: 'name usingMembers',
    }).then(groupToRes => {
      if (groupToRes)  {
        res.json(groupToRes);
      } else {
        res.json([])
      }
    })

  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({login: req.body.login, password: req.body.password}).select('name login role');
  
    if (!user) {
      res.status(404).json({ message: 'invalid credentials'});
    } else {
      res.json(user);
    }
    
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.addUser = async (req, res) => {
  try {
    const user = await new User({
      name: req.body.name,
      password: req.body.password,
      login: req.body.login,
      role: roles[req.body.role]
    });
    
    await user.save();
    res.json("new user saved");
    
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.editUser = async (req, res) => {
  try {
    const user = await User.findById(req.body.id)
    
    if (user) {
      if (user.password === req.body.password) {
        await User.updateOne({_id: req.body.id}, {$set: {
          name: req.body.name ? req.body.name : user.name,
          password: req.body.password1 ? req.body.password1 : user.password,
          login: req.body.login ? req.body.login : user.login,
          role: req.body.role ? req.body.role : user.role,
        }})
        await user.save();
        res.json("user updated")
      }
      else {
        res.status(404).json({ message: 'invalid credentials'});
      }
    } else {
      res.status(404).json({ message: 'user not found'});
    }
    
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.readInstructors = async (req, res) => {
  try {
    const musicians = await Musician.find({isInstructor: true})
    .select('-phone -email -address1 -address2 -instrument -isChild -parentName -parentPhone -isActive -joiningDate -birthDate -isStudent -isInstructor')
    .sort({lastName: 1});
  
    if (!musicians.length) {
      res.status(404).json({ message: 'not found !!'});
    } else {
      res.json(musicians);
    }

  } catch(err) {
    res.status(500).json({ message: err });
  }
}