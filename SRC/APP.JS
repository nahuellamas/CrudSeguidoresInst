const express = require('express');
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const APP = express();
require('./database');
require('./config/passport');



//conectar la base de datos /*'mongodb://localhost/crud-seguidores-mongo'*/
mongoose.connect('mongodb+srv://nahuellamas:xsJF2jS0q79suXR1@crud-seguidores-mongo.dwbiq.mongodb.net/crud-seguidores-mongo?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(db => console.log('BD conectada'))
    .catch(error => console.log('base de datos no conectada', error))

// Impor rutas
const indexRoutes = require('./routes/index.js');
//configuracion
APP.set('port', process.env.PORT || 3000);
APP.set('views', path.join(__dirname, 'views'));
APP.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(APP.get('views'), 'layouts'),
    partialsDir: path.join(APP.get('views'), 'partials'),
    extname: '.hbs'
}));
APP.set('view engine', '.hbs');
//midelware
APP.use(morgan('dev'));
APP.use(express.urlencoded({extended: false})); //solo quiero sus datos
APP.use(methodOverride('_method'));
APP.use(session({
    secret: 'seguidoresapp',
    resave: true,
    saveUninitialized: true
}));

APP.use(passport.initialize());
APP.use(passport.session());

APP.use(flash());

//Global VARIABLES
APP.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//rutas
APP.use(require('./routes/index'));
APP.use(require('./routes/notes'));
APP.use(require('./routes/users'));
//Statics files
APP.use(express.static(path.join(__dirname, 'public')));
//start server
APP.listen(APP.get('port'), () => {
    console.log(`Server en puerto ${APP.get('port')}`);
});


