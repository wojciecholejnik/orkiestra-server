const Musician = require('../models/musician.model');
const ContributionList = require('../models/contribution.model');
const jwt = require('jsonwebtoken');

exports.createContributionList = async (req, res) => {
  const year = req.body.year;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const isListExist = await ContributionList.find({year: year});
        if (isListExist && isListExist.length) {
          res.status(410).json({ message: 'List for this year is created'});
          return
        }
    
        await Musician.find({isActive: true, isStudent: false, role: {$gte: 2, $ne: '5'}}, '_id').sort({lastName: 1, firstName: 1}).then((findedMusicians) => {
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
          }).save().then(async (list) => {
            const listToSend = await ContributionList.findById(list._id).populate([{
              path: 'members.member', 
              model: Musician,
              select: ('firstName lastName contributionsAccount')
            }]);
            res.json(listToSend)
          })
        })
        
      }
        catch(err) {
          res.status(500).json({ message: err });
      }
    }
  })
  
}

exports.getContributionListForYear = async (req,res) => {
  const year = req.params.year;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
        res.status(500).json({message: err})
      }
    }
  })

  
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
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
  })
}

exports.editListMembers = async (req, res) => {
  const members = req.body.members;
  const listId = req.body.listId;

  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
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
  })
}

exports.removeList = async (req, res) => {
  const listId = req.body.listId
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const list = ContributionList.findById(listId);
        if (!list) {
          res.status(404).json({message: "List not found"})
        } else {
          await ContributionList.deleteOne({_id: listId});
          res.json({message: "List removed"});
        }
    
      } catch (e) {
        res.status(500).json({message: e})
      }
    }
  })
}