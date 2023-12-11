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

// img 못 불러오는 문제 경로 지정으로 해결
app.use('/login', express.static('./src/img'))
app.use('/admin', express.static('./src/img'))
app.use('/admin/mangePartner', express.static('./src/img'))

// 경로에 따른 css 맛갈때 가져오는 경로 지정법(정적 경로 일일히 지정해야 하는 작업필요)
app.use('/admin', express.static('./src/style'))

// 여기까지 건들필요없음

// 경로설정, 라우터
const gotoMain = require('./src/router/mainRouter');
const gotoPartner = require('./src/router/partnerRouter');
const gotoAdmin = require('./src/router/adminRouter');

const gotoSignup = require('./src/router/signupRouter');
const gotoPartnersignup = require('./src/router/partnersignupRouter');
const gotoPartnerlist = require('./src/router/partnerlistRouter');
const gotoPartnerboard = require('./src/router/partnerboardRouter');
const gotoMenu = require('./src/router/menuRouter');
const gotoMenu_reg = require('./src/router/menu_regRouter');
const gotoCart = require('./src/router/cartRouter');

app.use('/', gotoMain);
app.use('/partner', gotoPartner);
app.use('/admin', gotoAdmin);

app.use('/signup', gotoSignup);
app.use('/partnersignup', gotoPartnersignup);
app.use('/partnerlist', gotoPartnerlist);
app.use('/partnerboard', gotoPartnerboard);
app.use('/menu', gotoMenu);
app.use('/menu_reg', gotoMenu_reg);
app.use('/cart', gotoCart);

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
