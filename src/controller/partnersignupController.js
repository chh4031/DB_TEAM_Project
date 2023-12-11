const useDB = require('../../middleware/db');

// 유저 회원가입 화면 보여주는 컨트롤러
const partnersignupView = async(req, res) =>{
    return res.render("partnersignup")
}

const partnersignupView2 = async(req, res) => {
    const partnerno = req.body.partnerno;
    const partnername = req.body.partnername;
    const partnercategory = req.body.partnercategory;
    const partnerowner = req.body.partnerowner;
    const ownertel = req.body.ownertel;
    const partneraddress = req.body.partneraddress;
    const parteneragree = "FALSE";
    const partnerlating = 0;
    const latingcount = 0;
    const partnerreq = "TRUE";

    // 이미 가입된 사업자 번호 확인
    const checkno = 'SELECT * FROM 제휴매장 WHERE 사업자번호 = ?';
    const [existingCheckno] = await useDB.query(checkno, [partnerno]);

    if (existingCheckno.length < 0) {
        // 이미 가입된 사업자 번호인 경우 알람을 주고 요청 중단
        const alertnoMessage = '이미 가입된 사업자번호입니다.';
        res.rend(`<script>alert("${alertnoMessage}"); window.location.href="/";</script>`)
    } else {
        // 가입되지 않은 사업자 번호인 경우 요청 진행
        const insertPartnerQuery = 'INSERT INTO 제휴매장 (사업자번호, 제휴매장이름, 제휴매장분류, 제휴매장담장자, 제휴매장전화번호, 제휴매장주소, 제휴매장계약활성, 제휴매장평점, 제휴매장리뷰갯수, 제휴매장요청유무) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await useDB.query(insertPartnerQuery, [partnerno, partnername, partnercategory, partnerowner, ownertel, partneraddress, parteneragree, partnerlating, latingcount, partnerreq]);
        res.redirect('/');
    }
}

module.exports = {partnersignupView, partnersignupView2}