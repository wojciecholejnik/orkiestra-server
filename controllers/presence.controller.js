const Presence = require('../models/presence.model');
const jwt = require('jsonwebtoken');

exports.createPresence = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      const newPresence = {...req.body};

      try {
        const presence = new Presence(newPresence);
        await presence.save();
        res.json({message: 'ok'});
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
}

exports.readPresences = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const presences = await Presence.find({type: 'normal-lesson'}).sort({date: 1});
      
        if (!presences.length) {
          res.status(404).json({ message: 'not found !!'});
        } else {
          res.json(presences);
        }
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.readPresencesByDate = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const year = req.params.year;
        const presences = await Presence.find(
          {
            type: 'normal-lesson',
            date: {"$regex": year}
          }).sort({date: 1});
          
          res.json(presences);
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.deletePresence = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const presence = await Presence.findById(req.params.id);
      
        if (!presence) {
          res.status(404).json({ message: 'not found !!'});
        } else {
          await Presence.deleteOne({_id: req.params.id});
          res.json({message: 'ok'});
        }
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.updatePresence = async (req, res) => {
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const presence = await Presence.findById(req.params.id);
      
        if (!presence) {
          res.status(404).json({ message: 'not found !!'});
        } else {
          await Presence.updateOne({_id: req.params.id}, { $set: {
            date: req.body.hasOwnProperty('date') ? req.body.date : presences.date,
            type: req.body.hasOwnProperty('type') ? req.body.type : presences.type,
            members: req.body.hasOwnProperty('members') ? req.body.members : presences.members,
          }});
    
          res.json({message: 'ok'});
        }
    
      } catch(err) {
        res.status(500).json({ message: err });
      }
    }
  })
}