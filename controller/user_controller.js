const User = require('../models/user')
const bcrypt = require("bcrypt");
// const secretKey = crypto.randomBytes(32).toString("hex");
const passport = require('passport')



module.exports.login = function (req, res) {
    return res.render('login', {
        title: 'Login',
        showHeader: false,
        showFooter: false,
    })
}

module.exports.register = function (req, res) {
    return res.render('register', {
        title: 'Register',
        showHeader: false,
        showFooter: false
    })
}


module.exports.createUser = async function (req, res) {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash('error', 'Password did not match');
            return res.redirect('/signup');
        }
        const foundUser = await User.findOne({ email })

        if (foundUser) {
            req.flash('error', 'User already exists, Sign In!');
            return res.redirect('/login');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        req.flash('success', 'User created successfully!');
        return res.redirect('/login');

    } catch (error) {
        req.flash('error', 'Internal Server Error');
        return res.redirect('/login');
    }
}

module.exports.createSession = function (req, res, next) {
    req.flash('success', 'Logged in Successfully')
    console.log("hello");
    return res.redirect('/');
}

module.exports.logout = function (req, res) {
    req.logout(function (err) {
      if (err) {
        console.error(err);
      }
      req.flash('success', 'Logged out successfully');
      res.redirect('/login');
    });
  
  }

