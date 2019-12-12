const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
    //required: [true, 'Title is required'],
    //minlength: [4, 'Title is too short, must be minimum 4 characters!']
  },
  date: {
    type: Schema.Types.Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description is too short, must be minimum 10 characters!'],
    maxlength: [50, 'Description is too long, must be maximum 50 characters!']
  },
  report: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  creator: {
    type: mongoose.Types.ObjectId,
    //required: true
  }

});

module.exports = mongoose.model('Expense', expenseSchema);