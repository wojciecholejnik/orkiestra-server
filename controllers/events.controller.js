const Event = require('../models/event.model');
const Musician = require('../models/musician.model');

exports.getEventsListForYear = async (req,res) => {
  const year = req.params.year;
  
  try {
    const list = await Event.find({year: year}).populate([{
      path: 'members', 
      model: Musician,
      select: ('firstName lastName')
    }]).sort({dateFrom: 1})

    if (!list) {
      res.status(404).json({message: "Contribution list not found"})
    } else {
      res.json(list)
    }
  } catch (err) {
    res.status(500).json({message: err})
  }
}

exports.addNewEvent = async (req,res) => {
  const eventData = req.body;

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

exports.updateEvent = async (req,res) => {
  const eventData = req.body;

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

exports.deleteEvent = async (req,res) => {
  const id = req.body.id;

  try {
    await Event.deleteOne({_id: id})
    .then(() => {
      this.getEventsListForYear(req,res)
    })
    
  } catch (err) {
    res.status(500).json({message: err})
  }
}

