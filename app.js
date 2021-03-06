var createError = require('http-errors');
var express = require('express');
var path = require('path');
var imageurl = "";
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var numero = 0;

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


io.on('connection', function(socket){
    console.log("connected");
});

//PULSE SENSOR STARTS//
// Require the serialport node module
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

// Open the port
var port = new SerialPort("/dev/ttyACM0", {
    baudrate: 9600,
    //parser: serialport.parsers.readline("\n")
});

port.on('open', onOpen);
port.on('data', onData);

function onOpen(){
    console.log('/dev/ttyACM0 serial connected!');
}

function onData(data){
	io.emit('socketHeartRate', heartRate());
}

// PULSE SENSOR ENDS //
var numero = 0;

function heartRate() {
  
  if(numero == 0) {
	  numero = 1;
    return "./images/heartSmall.png"
  } else {
	  numero = 0;
    return "./images/heartRegular.png"
  }

}

http.listen(3001, function(){
    console.log('listening on *:3000');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
