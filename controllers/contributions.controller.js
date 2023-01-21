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

    await Musician.find({isActive: true, isStudent: false, role: {$gte: 2}}, '_id').sort({lastName: 1, firstName: 1}).then((findedMusicians) => {
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
      select: ('firstName lastName contributionsAccount')
    }])
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

exports.editContributeListForMember = async (req, res) => {
  const listId = req.body.listId;
  const memberId = req.body.memberId;
  const months = req.body.months;
  const memberContributionsAccount = req.body.memberContributionsAccount;

  const list = await ContributionList.findById(listId);
  if (!list) {
    res.status(404).json({message: 'List not found'})
  } else {

    const member = list.members.find(member => member.member == memberId);

    if (member) {
      const indexOfMember = list.members.indexOf(member);
      list.members[indexOfMember].months = months
      await list.save().then(async () => {
        await Musician.updateOne({_id: memberId}, { $set: {
          contributionsAccount: memberContributionsAccount ? memberContributionsAccount : 0,
        }}).then(async () => {
          const updatedList = await ContributionList.findById(listId).populate([{
            path: 'members.member', 
            model: Musician,
            select: ('firstName lastName contributionsAccount')
          }]); 
          res.json(updatedList)
        });
      });

    } else {
      res.status(404).json({message: 'not found'})
    }
  }
}

exports.editListMembers = async (req, res) => {
  const members = req.body.members;
  const listId = req.body.listId;

  try {
    const list = await ContributionList.findById(listId);

    if (list) {
      const updatedList = await ContributionList.updateOne({_id: listId}, {$set: {
        members: members
      }})
      if (updatedList) {
        const listToSend = await ContributionList.findById(listId).populate([{
          path: 'members.member', 
          model: Musician,
          select: ('firstName lastName contributionsAccount')
        }]);
        res.json(listToSend)
      }
    } else {
      res.status(404).json({message: 'Contribution list not found.'})
    }

  } catch (e) {
    res.status(500).json({message: e})
  }
}