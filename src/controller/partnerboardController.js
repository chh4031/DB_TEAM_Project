const useDB = require('../../middleware/db');

// 제휴매장 게시판 보여주는 컨트롤러
const partnerboardView = async (req, res) => {
    try {
        const userid = req.session.loginId

        const q1 = 'SELECT DISTINCT 제휴매장_사업자번호 FROM 메뉴주문 WHERE 회원_아이디 = ?';
        const result = await useDB.query(q1, userid);
        const uniqueBusinessNumbers = result[0].map(item => item.제휴매장_사업자번호);

        return res.render('partnerboard', { data: uniqueBusinessNumbers,
            loginId : req.session.loginId });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const partnerboardView2 = async (req,res) => {
    const userid = req.session.loginId
    const boardname = req.body.boardname
    const boardinfo = req.body.boardinfo
    const partnerno = req.body.partnerno

    const q1 = 'SELECT * FROM 제휴매장, 메뉴주문 WHERE 사업자번호 = ?'
    const [check] = await useDB.query(q1, partnerno);
    
    const partnername = check[0].제휴매장이름

    // 현재 날짜와 시간 가져오기
    const currentDate = new Date();
    const signupdate = currentDate.toISOString().split('T')[0];

    const insertBoardQuery = 'INSERT INTO 제휴매장게시판 (제목, 내용, 작성일자, 회원_아이디, 제휴매장_사업자번호, 추천수, 제휴매장이름) VALUES (?, ?, ?, ?, ?, ?, ?);'
    await useDB.query(insertBoardQuery, [boardname, boardinfo, signupdate, userid, partnerno, 0, partnername])
    return res.redirect('partnerboardlist')
}

module.exports = {partnerboardView, partnerboardView2}