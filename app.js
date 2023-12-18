let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);
const cron = require('node-cron');
const moment = require('moment');

const useDB = require('./middleware/db');

// 오늘날짜출력
let today = moment().format("YYYY-MM-DD")
// 오늘년도 출력
let year = moment().format("YYYY");
// let year = moment().format("2024");
// 90일뒤 날짜 출력
let day_90 = moment().add(90, "d").format("YYYY-MM-DD")

// 시작분기(초기값은 2023-1인데 현재 DB에 데이터저장한게 있음. 그래서 DB 데이터에 따라 변경)
let max = "2023-4";
let date = 4;

// 분기정보 구하는 로직(매일 0시 0분에 실행)
cron.schedule('0 0 0 * * *', async () => {

  const updateDateDB = useDB.query(`
  update 분기 set 분기일수 = 분기일수 - 1 where 분기번호 = ?`, [max])

  const checkDateDB = await useDB.query(`
  select 분기일수 from 분기 where 분기번호 = ?`, [max])

  console.log(checkDateDB[0][0])
  
  if (checkDateDB[0][0].분기일수 == 0){
    if(date == 4){
      date = 0
    }

    date += 1
    max = year + "-" + date

    const newDate = await useDB.query(`
    insert into 분기(분기번호, 분기일수, 분기시작일, 분기종료일) values(?,?,?,?)`, [max, 90, today, day_90])
  }
  console.log(max)
});


// 분기 업데이트하는거
cron.schedule('0 0 */90 * * *', async () => {

    const updateDateDB = await useDB.query(`
    select * from 제휴매장분기별등급`)
  
    for(let i = 0; i < updateDateDB[0].length; i++){
      let DateNUM = updateDateDB[0][i].분기별등급식별번호
      let kind = ""
      let Namename = updateDateDB[0][i].제휴매장_사업자번호

      const DBnum = await useDB.query(`
      select 분기별총수익 from 제휴매장분기별등급 where 분기별등급식별번호 = ?`, [DateNUM])

      if(DBnum[0][0].분기별총수익 < 500000){
        kind = "1등급"
      }else if(DBnum[0][0].분기별총수익 < 300000){
        kind = "2등급"
      }else if(DBnum[0][0].분기별총수익 < 100000){
        kind = "3등급"
      }else{
        kind = "4등급"
      }

      const updateDB = await useDB.query(`
      update 제휴매장분기별등급 set 분기별지급액 = 분기별총수익 * 분기별등급지급률 * 0.01, 분기별등급 = ? where 분기별등급식별번호 = ?`,[kind, DateNUM])

      const presentDate = await useDB.query(`
      select max(분기번호) as 분기번호 from 분기`)

      const insertMarket = await useDB.query(`
      insert into 제휴매장분기별등급(분기별총수익, 분기별지급액, 분기별등급, 분기별등급_하락방지적용, 분기별등급지급률, 관리자부여등급혜택여부, 협의내용, 특별승급대상자여부, 제휴매장_사업자번호, 분기_분기번호) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [0, 0, "3등급", "없음", 0, "False", "없음", "False", Namename,presentDate[0][0].분기번호])
    }
});

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
-
// img 못 불러오는 문제 경로 지정으로 해결
app.use('/login', express.static('./src/img'))
app.use('/admin', express.static('./src/img'))
app.use('/admin/mangePartner', express.static('./src/img'))
app.use('/admin/usergrade', express.static('./src/img'))
app.use('/admin/menuInfo', express.static('./src/img'))

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

const gotoOrder = require('./src/router/orderRouter');
const checkOrder = require('./src/router/checkRouter');
const gotoPartnerboardlist = require('./src/router/partnerboardlistRouter');
const gotoMyPage = require('./src/router/mypageRouter');

const gotoMypartner = require("./src/router/mypartnerRouter");

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

app.use('/order', gotoOrder);
app.use('/check', checkOrder);
app.use('/partnerboardlist', gotoPartnerboardlist);
app.use('/mypage', gotoMyPage);

app.use('/mypartner', gotoMypartner);

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
