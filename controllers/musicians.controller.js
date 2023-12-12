const Musician = require('../models/musician.model');
const Instrument = require('../models/instrument.model'); 
const Section = require('../models/section.model');
const ResourceInstrument = require('../models/resourceInstrument.model');
const UniformGroup = require('../models/uniform-group.model');
const UniformItem = require('../models/uniform-item.model');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const sortByLastName = function(a, b) {
  const result = a.lastName.localeCompare(b.lastName);
  if (result === 0) {
    return a.firstName.localeCompare(b.firstName)
  } else {
    return result
  }
}

exports.createMusician = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      const newMusician = {...req.body, role: "3", login: '', password: '', contributionsAccount: 0};

      try {
        const musician = new Musician(newMusician);
        await musician.save();
        res.json({ message: 'OK' });
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
}

exports.readMusicians = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find().select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
}

exports.readMusicianById = async (req, res) => {
  try {
    const musician = await Musician.findOne({_id: req.params.id}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
    const musicians = await Musician.find({isActive: true, role: { $ne: '5' }}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
  })
  
}

exports.readExMusicians = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find({isActive: false}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
}

exports.readMainStaffMuscians = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find({isActive: true, isStudent: false, role: { $ne: '5' }}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
}

exports.readMainStudentsMusicians = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find({isActive: true, isStudent: true}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
  
}

exports.readSpectators= async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find({role: "5"}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
  
}

exports.updateMusician = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
            login: req.body.hasOwnProperty('login') ? req.body.login : musician.login,
            role: req.body.hasOwnProperty('role') ? req.body.role : musician.role,
            password: req.body.hasOwnProperty('password') ? req.body.password : musician.password,
          }});
    
          musician = await Musician.findOne({_id: req.params.id}).select({ "login": 0, "password": 0, "role": 0}).populate([
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
  })
  
}

exports.deleteMusician = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
  })
  
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

exports.readMemberInstruments = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const resourceInstruments = await ResourceInstrument.find({user: req.params.id}).populate({
          path: 'type', 
          model: Instrument,
          select: '-user'
        }).sort('type');
        res.json(resourceInstruments)
    
      }
      catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.loginUser = async (req, res) => {
  try {
    const user = await Musician
    .findOne({login: req.body.login, password: req.body.password})
    .select('firstName lastName login role');
  
    if (!user) {
      res.status(404).json({ message: 'invalid credentials'});
    } else {
        jwt.sign({user}, process.env.TOKEN_KEY, (err, token) => {
          res.json({
            token,
            user
          })
        }
      )
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.addUser = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
  })
}

exports.editUser = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const user = await Musician.findById(req.body.id)
        
        if (user) {
          if (user.password === req.body.password) {
            const isLoginExist = await Musician.findOne({login: req.body.login});
            if (!isLoginExist || (isLoginExist._id.equals(user._id))) {
              await Musician.updateOne({_id: req.body.id}, {$set: {
                name: req.body.name ? req.body.name : user.name,
                password: req.body.password1 ? req.body.password1 : user.password,
                login: req.body.login ? req.body.login : user.login,
                role: req.body.role ? req.body.role : user.role,
              }})
              await user.save();
              res.json("user updated")
            } else {
              res.status(402).json({message: "Taki login już istnieje"})
            }
          }
          else {
            res.status(404).json({ message: 'Podane hasło jest niewłaściwe'});
          }
        } else {
          res.status(404).json({ message: 'user not found'});
        }
        
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.readInstructors = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find({ isActive: true, $or:[ {'role':"1"}, {'role':"0"}]})
        .select('-phone -email -address1 -address2 -instrument -isChild -parentName -parentPhone -isActive -joiningDate -birthDate -isStudent -isInstructor -login -password')
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
  })
  
}

exports.readUsersToManage = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const musicians = await Musician.find().select('firstName lastName login role isActive')
      
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
  })
  
}

exports.manageUser = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const user = await Musician.findById(req.body._id)
        
        if (user) {
            await Musician.updateOne(
              { _id: req.body._id}, 
              {
                $set: {
                  role: req.body.hasOwnProperty('role') ? req.body.role : user.role,
                  login: req.body.hasOwnProperty('login') ? req.body.login : user.login,
                  password: req.body.hasOwnProperty('password') ? req.body.password : user.password,
                }
              }
            )
            const musicians = await Musician.find().select('firstName lastName login role isActive').sort({"lastName": 1})
            res.json(musicians)
        } else {
          res.status(404).json({ message: 'user not found'});
        }
        
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}