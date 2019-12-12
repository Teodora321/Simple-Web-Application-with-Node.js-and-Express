const models = require('../models');

function index(req, res, next) {

  // const {
  //   search
  // } = req.query;

  // let query = {};

  // if (search) {
  //   query = {
  //     ...query,
  //     title: {
  //       $regex: search
  //     }
  //   };
  // }

  models.expenseModel
    .find()
    .then(expenses => {

      const hbsObject = {
        pageTitle: 'Home Page',
        expenses
      };

      res.render('index.hbs', {
        hbsObject
      });
    }).catch(next);
}


function getCreate(req, res, next) {
  const hbsObject = {
    pageTitle: 'Create Expense',
  };
  res.render('create.hbs', {
    hbsObject
  });
}


function postCreate(req, res, next) {
  const {
    title,
    description,
    amount,
    category,
  } = req.body;

  //const report = isPublic === 'on';

  models.expenseModel.create({
      title,
      description,
      amount,
      category,
      creator: req.user._id
    })
    .then(expense => {
      res.redirect('/expenses');
    }).catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'MongoooseError') {
        const messages = Object.entries(err.errors).map(e => {
          return e[1].message;
        })
        const hbsObject = {
          messages,
          pageTitle: 'Create Course'
        }
        res.render('create.hbs', {
          hbsObject
        });
        return;
      }
    });;
}

function getExpenses(req, res, next) {
  
  models.expenseModel.find().then(expenses => {
    const hbsObject = {
      expenses,
      pageTitle: 'Expenses',
      // isCreator: req.user.id.toString() === expenses.creator.toString(),
      //isCreator: req.user.id.toString() === expenses.creator.toString(),
    };
    res.render('expenses.hbs', {
      hbsObject
    });
  }).catch(next);
   
  
}

function getReport(req, res, next) {

  const id = req.params.id;

  models.expenseModel.findById(id).then(expense => {
    const hbsObject = {
      expense,
      pageTitle: 'Report',
      //isCreator: req.user.id.toString() === video.creator.toString(),
      //isEnrolled: video.enrolledUsers.includes(req.user.id)
    }

    res.render('report.hbs', {
      hbsObject
    });
  }).catch(next);
}


  function deleteExpense(req, res, next) {
    const id = req.params.id;
    models.expenseModel
      .findByIdAndRemove({
        _id: id
      })
      .then(() => {
        res.redirect('/expenses');
      }).catch(next);
  }



module.exports = {
  index,
  getCreate,
  postCreate,
  getExpenses,
  getReport,
  deleteExpense

}