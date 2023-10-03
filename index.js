const express = require('express');
const app = express()
const session = require('express-session');
const passport = require('passport');
const db = require('./config/mongoose')
const mongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passportLocal = require('./config/passport-local-strategy');
const customWare = require('./config/middleware')
const port = 8000
const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");
const expressLayouts = require('express-ejs-layouts');
const path = require('path');


app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))

app.use(
  "/css",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
  )
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "js")
  )
);

app.use(
  "/node_modules/noty/lib",
  express.static(
    path.join(__dirname, "node_modules", "noty", "lib")
  )
);

// app.use(
//   ""
// )

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set('views', __dirname + '/views')


app.use(
  session({
    name: 'employeereviewsystem',
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000
    },

    store: mongoStore.create({
      mongoUrl: 'mongodb://0.0.0.0/employeereviewsystem',
      mongooseConnection: db,
      autoRemove: 'disabled'
    })
  })
)


app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use(flash())
app.use(customWare.setFlash)


app.use("/", require("./routes/index"));




app.listen(port, function (err) {
  if (err) {
    console.log("error running the server", err);
  }
  console.log("Server is running on :", port);
})