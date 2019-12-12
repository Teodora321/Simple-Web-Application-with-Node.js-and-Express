const expenseController = require('../controllers/expense');
const authController = require('../controllers/auth');
const { auth } = require('../utils');

module.exports = (app) => {

    app.get('/expense/delete/:id', auth() , expenseController.deleteExpense);
    
    app.get('/expense/report/:id', auth() , expenseController.getReport);
    // app.post('/course/edit/:id', auth() , videoController.postEdit);
    
    // app.get('/course/details/:id', auth(), videoController.getDetails);

    // app.get('/course/enroll/:id', auth(false), videoController.enroll);
    app.get('/expenses', auth(), expenseController.getExpenses);
   app.get('/expense/create', auth(), expenseController.getCreate);
    app.post('/expense/create', auth(), expenseController.postCreate);

    app.get('/login', authController.login);
    app.post('/login', authController.loginPost);

    app.get('/register', authController.register);
    app.post('/register', authController.registerPost);
    
    app.get('/logout', authController.logout);

    app.get('/', auth(false), expenseController.index);
    app.get('*', (req, res) => { res.render('500.hbs'); });
};