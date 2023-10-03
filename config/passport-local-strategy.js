const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const user = require('../models/user');

passport.use(
    new localStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async function (req, email, password, done) {
            try {
                const findUser = await user.findOne({ email });

                if (!findUser) {
                    req.flash('error', 'User not found'); // Flash message for user not found
                    return done(null, false);

                }
                // return done(null , findUser);
                const passwordMatch = await bcrypt.compare(password, findUser.password)

                if (!passwordMatch) {
                    req.flash('error', 'Incorrect password');
                    return done(null, false);

                }
                req.flash('success', 'Logged in successfully');
                return done(null, findUser)

            } catch (error) {
                req.flash('error', 'Internal Server Error');
                return done(error)
            }
        }
    )
)


passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    try {
        user.findById(id)
            .then((result) => {
                return done(null, result)
            })
    } catch (error) {
        console.log("Error in handling the user");
        return done(error)
    }
})


passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error', 'Sign In first!')
    return res.redirect('/login')
}


passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}

module.exports = passport;