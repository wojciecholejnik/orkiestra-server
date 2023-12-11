const Accounting = require('../models/accounting.model');
const jwt = require('jsonwebtoken');

exports.getContributionListForYear = async (req,res) => {
  const year = req.params.year;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        await Accounting.findOne({year: year}).lean().exec(function (err, budgetElem) {
          if (!budgetElem) {
            res.status(404).json({message: "Nie znaleziono budżetu dla wybranego roku"})
          } else {
            res.json({
              ...budgetElem, 
              history: budgetElem.history.sort((a,b) => new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1),
            })
          }
        })
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

exports.getAllActiveBudgets = async (req,res) => {
  const year  = Number(req.params.year)
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const budgets = await Accounting.find({isClosed: false, year: {$gt: year}}).sort({year: 1})
        if (!budgets) {
          res.status(404).json({message: "Nie znaleziono pasującyhc wyników"})
        } else {
          res.json(budgets)
        }
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

exports.createAccountingList = async (req,res) => {
  const year = req.body.year;
  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, data)=>{
    if(err) {
        res.sendStatus(403);
    } else {
      const author = data.user.firstName + ' ' + data.user.lastName
      try {
        const isListExist = await Accounting.findOne({year: year})
        if (!isListExist) {
          new Accounting({
            year: year,
            balance: 0,
            isClosed: false,
            history: [{
              author: author,
              date: new Date(`${year}-01-01`).toUTCString(),
              value: 0,
              description: `Utworzenie nowego budżetu dla roku ${year}`
            }]
          }).save().then(async () => {
            const listToSend = await Accounting.findOne({year: year})
            res.json(listToSend)
          })
        } else {
          res.status(410).json({ message: 'List for this year has been created'});
        }
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

exports.editAccountingList = async (req,res) => {
  const {id, value, description, date} = req.body;

  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, data)=>{
    const user = data.user;
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        const accountingList = await Accounting.findById(id)
        if (!accountingList) {
          res.status(404).json({ message: 'Nie znaleziono budżetu dla wybranego roku'});
        } else {
          Accounting.updateOne({_id: id}, {
            $push: {"history": {
              author: `${user.firstName} ${user.lastName}`,
              value,
              description,
              date: !date ? new Date().toUTCString() : new Date(date).toUTCString()
            }},
            $inc: {"balance": value}
          }).then(async () => {
            await Accounting.findById(id).lean().exec(function (err, budgetElem) {
              if (!budgetElem) {
                res.status(404).json({message: "Nie znaleziono takiego budżetu"})
              } else {
                res.json({
                  ...budgetElem, 
                  history: budgetElem.history.sort((a,b) => new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1),
                })
              }
            })
          })
        }
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

exports.closeBudgetForYear = async (req,res) => {
  const {id, toId} = req.body;

  jwt.verify(req.token, process.env.TOKEN_KEY, async (err, data)=>{
    const user = data.user;
    let yearForClose = 0;
    let valueToTransfer = 0;
    if(err) {
        res.sendStatus(403);
    } else {
      try {
        await Accounting.findOne({_id: id, isClosed: false})
        .then(async (data) => {
          if (data) {
            await Accounting.updateOne({_id: id}, {
              $set: {"isClosed": true},
              $push: {"history": {
                author: `${user.firstName} ${user.lastName}`,
                value: 0,
                description: `Zamknięcie budżetu za rok ${data.year} i przesunięcie salda końcowego.`,
                date: new Date().toUTCString()
              }},
            })
            .then(async () => {
              await Accounting.updateOne({_id: toId}, {
                $push: {"history": {
                  author: `${user.firstName} ${user.lastName}`,
                  value: data.balance,
                  description: `Zamknięcie budżetu za rok ${data.year} i przesunięcie sald końcowego`,
                  date: new Date().toUTCString()
                }},
                $inc: {"balance": data.balance}
              })
              .then(async () => {
                await Accounting.findById(id).lean().exec(function (err, budgetElem) {
                  if (!budgetElem) {
                    res.status(404).json({message: "Nie znaleziono takiego budżetu"})
                  } else {
                    res.json({
                      ...budgetElem, 
                      history: budgetElem.history.sort((a,b) => new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1),
                    })
                  }
                })
              })
            })
          }

        })
          
      } catch (err) {
        res.status(500).json({message: err})
      }
    }
  })
}

