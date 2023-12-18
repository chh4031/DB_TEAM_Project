const useDB = require('../../middleware/db');

// 유저 회원가입 화면 보여주는 컨트롤러
const signupView = async(req, res) =>{
    return res.render("signup")
}

const signupView2 = async(req, res) => {
    const userid = req.body.userid;
    const userpw1 = req.body.userpw1;
    const userpw2 = req.body.userpw2;
    const username = req.body.username;
    const usertel = req.body.usertel;
    const usercategory = "회원";
    const userpoint = 0;
    const usersleep = "False"
    const usercurrentpoint = 0;

        // 비밀번호 확인
        if (userpw1 !== userpw2) {
            const alertpwMessage = '비밀번호가 일치하지 않습니다.';
            res.send(`<script>alert("${alertpwMessage}"); window.location.href="/";</script>`);
        };

        // 현재 날짜와 시간 가져오기
        const currentDate = new Date();
        const signupdate = currentDate.toISOString().split('T')[0];

        // 이미 가입된 id 확인
        const checkid = 'SELECT * FROM 회원 WHERE 아이디 = ?';
        const [existingUserRows] = await useDB.query(checkid, [userid]);

        if (existingUserRows.length > 0) {
            // 이미 가입된 id인 경우 알람을 주고 회원가입 중단
            const alertidMessage = '이미 가입된 아이디입니다. 다른 아이디를 사용해주세요.';
            res.send(`<script>alert("${alertidMessage}"); window.location.href="/";</script>`);
        } else {
            // 가입되지 않은 아이디인 경우 회원가입 진행
            const insertUserQuery = 'INSERT INTO 회원 (아이디, 비밀번호, 이름, 전화번호, 가입날짜, 회원구분, 포인트, 휴먼계정여부, 이번분기포인트) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await useDB.query(insertUserQuery, [userid, userpw1, username, usertel, signupdate, usercategory, userpoint, usersleep, usercurrentpoint]);
            res.redirect('/');
        }
};

module.exports = {signupView, signupView2}