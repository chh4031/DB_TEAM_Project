const useDB = require('../../middleware/db');
const time = require("../function/time")

// 오늘 날짜 추출하는 함수
const today = `${time.time().year}-${time.time().month}-${time.time().date}`


// 메인 화면 보여주는 컨트롤러
const mainView = async(req, res) =>{
    return res.render("main", {
        loginId : req.session.loginId
    })
}

// 로그인 화면 보여주는 컨트롤러
const login = async(req, res) =>{
    return res.render("login")
}

// 로그아웃하는 로직
const logout = async(req, res) => {
    // 세션 삭제 체크
    req.session.destroy((err) => {
        if(err){
            console.log("로그아웃 실패, 세션 삭제 오류")
            return res.status(500).send("세션삭제오류발생")
        }else{
            console.log("로그아웃 성공, 세션 삭제 완료")
            return res.redirect("/")
        }
    }) 
    
}

// 로그인 체크하는 로직
const checkLogin = async(req, res) => {

    // login.ejs에서 가져오기
    const {loginId, loginPwd} = req.body

    const check = await useDB.query(`
    select * from 회원 where 아이디 = ? and 비밀번호 = ?`, [loginId, loginPwd])

    if(check[0][0] == undefined){
        console.log("로그인 실패");
        return res.send('<script type = "text/javascript">alert("로그인 실패"); location.href="/logi";</script>')
    }else{
        console.log("로그인 성공")

        // 로그인 날짜 갱신
        const updateDate = await useDB.query(`
        update 회원 set 로그인날짜 = ? where 아이디 = ?`, [today, loginId])
        
        req.session.loginId = loginId;

        return res.render("main", {
            loginId : loginId
        })
    }
}

module.exports = {mainView, login, checkLogin, logout}  