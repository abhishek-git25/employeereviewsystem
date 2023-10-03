const mongoose =  require('mongoose');

mongoose.connect(`mongodb://0.0.0.0/employeereviewsystem`);

const db = mongoose.connection;

db.on('error' ,  console.error.bind(console , 'Error'));

db.once('open' , function(){
    console.log('Conntected to database');
})

module.exports = db;