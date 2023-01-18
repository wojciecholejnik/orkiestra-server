const Musician = require('../models/musician.model');
const ContributionList = require('../models/contribution.model');

exports.createContributionList = async (req, res) => {
  const year = req.body.year
  try {

    const isListEgzist = await ContributionList.find({year: year});

    if (isListEgzist && isListEgzist.length) {
      res.status(410).json({ message: 'List for this year is created'});
      return
    }

    await Musician.find({isActive: true, isStudent: false}, '_id').then((findedMusicians) => {
      const a = findedMusicians.map(item => ({
        member: item._doc._id,
        months: addMonths()
      }))
      return a
    }).then(b => {
      new ContributionList({
        year: year,
        isClosed: false,
        members: b,
      }).save().then((list) => {
        res.json({message: list})
      })
    })
    
  }
    catch(err) {
      res.status(500).json({ message: err });
  }
}

exports.getContributionListForYear = async (req,res) => {
  const year = req.params.year;

  try {
    const list = await ContributionList.findOne({year: year}).populate([{
      path: 'members.member', 
      model: Musician,
      select: ('firstName lastName')
    },])
    if (!list) {
      res.status(404).json({message: "Contribution list not found"})
    } else {
      res.json(list)
    }
  } catch (err) {

  }
}

function addMonths() {
  months = [];
  for (let i = 0; i < 12; i++) {
    months.push({
      monthNumber: i,
      paid: false
    })
  }
  return months
}