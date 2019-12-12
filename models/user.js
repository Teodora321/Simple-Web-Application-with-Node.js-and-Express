const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter username'],
        unique: true,
         minlength: [4, 'Username is too short!']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength:[8, 'Password is too short!']
    },
    amount: {
        type: Number,
        required: true,
        default:0
    },
    expenses: [{ type: mongoose.Types.ObjectId, ref: 'Expense' }],
});

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return; }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);