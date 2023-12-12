const Event = require('../models/event.model');
const Musician = require('../models/musician.model');
const jwt = require('jsonwebtoken');

exports.getEventsListForYear = async (req,res) => {
  const year = req.params.year;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const list = await Event.find({year: year}).populate([
          {
            path: 'members', 
            model: Musician,
            select: ('firstName lastName')
          },
          {
            path: 'membersAbsent', 
            model: Musician,
            select: ('firstName lastName')
          }
        ]).sort({dateFrom: 1})
    
        if (!list) {
          res.status(404).json({message: "Contribution list not found"})
        } else {
          res.json(list)
        }
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })

}

exports.getEventsById = async (req,res) => {
  
  try {
    const list = await Event.findOne({_id: req.params.id}).populate([
      {
        path: 'members', 
        model: Musician,
        select: ('firstName lastName'),
        options: {sort: {lastName: 1}, collation: { locale: "pl", caseLevel: true }}
      },
      {
        path: 'membersAbsent', 
        model: Musician,
        select: ('firstName lastName'),
        options: {sort: {lastName: 1}, collation: { locale: "pl", caseLevel: true }}
      }
  ]).sort({dateFrom: 1})

    res.json(list)
  } catch (err) {
    res.status(500).json({message: err})
  }
}

exports.getNearestEvent = async (req,res) => {
  
  try {
    jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
      if(err) {
          res.sendStatus(403);
      } else {
        const list = await Event.find({dateFrom: { $gte: new Date().toISOString() },}).populate([{
          path: 'members', 
          model: Musician,
          select: ('firstName lastName')
        }]).sort({dateFrom: 1})
        if (!list) {
          res.status(404).json({message: "Contribution list not found"})
        } else {
          res.json(list)
        }
      }
    })
  } catch (err) {
    res.status(500).json({message: err})
  }
}

exports.addNewEvent = async (req,res) => {
  const eventData = req.body;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const newEvent = await new Event(eventData);
        if (eventData) {
          await newEvent.save().then(async () => {
            this.getEventsListForYear(req,res)
          })
        } else {
          res.status(500).json({message: 'Nie udało się zapisać wydarzenia'})
        }
        
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
  
}

exports.updateEvent = async (req,res) => {
  const eventData = req.body;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const findedEvent = await Event.findById(eventData._id);
        if (findedEvent) {
          await Event.updateOne({_id: eventData._id}, {$set: {...eventData}}).then(() => {
            this.getEventsListForYear(req,res)
          })
        } else {
          res.status(404).json({message: 'Nie udało się znaleźć wydarzenia'})
        }
        
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

exports.deleteEvent = async (req,res) => {
  const id = req.body.id;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        await Event.deleteOne({_id: id})
        .then(() => {
          this.getEventsListForYear(req,res)
        })
        
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
  
}

