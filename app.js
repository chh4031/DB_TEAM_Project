let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);

let app = express();

// 세션 DB 설정
const options = {
  host : "localhost",
  user : 'root',
  password : '0000',
  port : 15628,
  database : 'mydb',
  clearExpired: true, // 유효기간 지나 세션 삭제
  checkExpirationInterval: 60000, // 세션 유효시간 체크 1분
  expiration: 3600000 //세션의 유효시간
}

let sessionStore = new MySQLStore(options);

app.use(session({
  secret : "20191598", // 세션보호 비밀키
    resave : false, // 세션 저장 여부 보통 false
    saveUninitialized : true, // 초기화되지 않은 세션 저장 여부 보통 true
    store : sessionStore, // DB 설정으로
    cookie : {
      maxAge : 3600000, // 세션 초기화 1시간
      httpOnly : true // 자바스크립트에서 쿠키접근 제한
    }
}))

// view engine setup, 프론트 셋업, 건들필요 x
app.set('views', path.join(__dirname, '/src/page'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/src/style')));
app.use(express.static(path.join(__dirname,'./src/img')))
// 여기까지 건들필요없음

// 경로설정, 라우터
const gotoMain = require('./src/router/mainRouter');
const gotoPartner = require('./src/router/partnerRouter');

app.use('/', gotoMain);
app.use('/partner', gotoPartner);

// catch 404 and forward to error handler, 에러 처리부분(건들지말것)
app.use(function(req, res, next) {
  next(createError(404));
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
