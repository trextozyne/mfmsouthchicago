// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('express-flash');
let path = require('path');

// Imports routes for the products
const photoalbum = require('./routes/photoalbum.route');
const events = require('./routes/events.route');
const verse = require('./routes/verse.route');
const trackRoute = require('./routes/tracks.route');
const fileRoute = require('./routes/files.route');
const slideRoute = require('./routes/slides.route');
const galleryCountCountRoute = require('./routes/gallery_count.route');
const userRoute = require('./routes/user.route');
const ytplayListRoute = require('./routes/ytplayList.route');
const ytplayLiveRoute = require('./routes/ytplayLive.route');
// import { cloudinaryConfig } from './config/cloudinaryConfig';
/////////////////////
const app = express();
/////////////////////
// Set up mongoose connection
const mongoose = require('mongoose');
// let dev_db_url = 'mongodb://Trex_son:@ds243254.mlab.com:43254/photoalbumdb';//change to mfmdb
let dev_db_url = 'mongodb+srv://Trex_son:Salvat1on1987@photoalbumdb.zhhua.mongodb.net/photoalbumdb?retryWrites=true&w=majority';//change to mfmdb

let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });//mongoose.set('useFindAndModify', false);

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = db;
module.exports = mongoose;

app.use(cors());
// app.use('*', cloudinaryConfig);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(session({secret: "S@lv@t10n_G0d", resave: false, saveUninitialized:true, cookie: { maxAge: Date.now() + (30 * 86400 * 1000)  } }));//shouldnt be storing secret in a public repository, should be in an environment variable
app.use(flash());

app.use(express.static(path.join(__dirname, 'Views')));//important
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/event-calendar-module', express.static(path.join(__dirname, 'event-calendar-module')));

app.set('views', path.join(__dirname, './Views'));//important

app.get('/.well-known/acme-challenge/:content', function(req, res) {
    res.send('d_eKQ-hHmpBFdFRNJyssKNi4n4RYdkLQIhzyMLi1-EI.Fdf1QYQc20L-eH7l9XV-rIdRtS8ae3XHetX0zvMUY6U')
})

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/photoalbums', photoalbum);
app.use('/events', events);
app.use('/verse', verse);
app.use('/tracks', trackRoute);
app.use('/files', fileRoute);
app.use('/slides', slideRoute);
app.use('/gallerycount', galleryCountCountRoute);
app.use('/user', userRoute);
app.use('/ytplayList', ytplayListRoute);
app.use('/ytplayLive', ytplayLiveRoute);

//handle 400
app.use((req, res)=> {
    res.status(400);
    res.sendFile(path.resolve('./Views', 'not-found.html'));
});
//handlle 500
app.use((error, req, res, next)=> {
    res.status(500);
    res.sendFile(path.resolve('./Views', 'error-not-found.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
