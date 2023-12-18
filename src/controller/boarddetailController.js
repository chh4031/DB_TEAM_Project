const useDB = require('../../middleware/db');

const boarddetailView = async (req, res) => {
    const boardno = req.params.boardno_number;
    const q1 = 'SELECT * FROM 제휴매장게시판 WHERE 글번호 = ?';

    const q2 = 'SELECT * FROM 댓글 WHERE 제휴매장게시판_글번호 = ?';

    try {
        const result = await useDB.query(q1, [boardno]);
        const result2 = await useDB.query(q2, [boardno])

        if (result[0].length > 0) {
            res.render('boarddetail', { data: result[0][0], 
            data2 : result2[0],
            loginId : req.session.loginId });
        } else {
            // 주어진 사업자 번호에 대한 데이터가 없는 경우
            res.status(404).send('게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('게시글 조회 중 오류 발생 : ', error);
        res.status(500).send('게시글 조회 중 오류가 발생했습니다.');
    }
};

const boarddetailView2 = async (req, res) => {
    const boardno = req.params.boardno_number;
    const type = req.query.type
    const userid = req.session.loginId
    const currentDate = new Date();
    const signupdate = currentDate.toISOString().split('T')[0];

    if (type === 'recommend') {
        const q1 = 'UPDATE 제휴매장게시판 SET 추천수 = 추천수 + 1 WHERE 글번호 = ?';

        await useDB.query(q1, [boardno]);

        const q2 = 'SELECT 제휴매장게시판.추천수 FROM 제휴매장게시판 WHERE 글번호 = ?';
        
        const plus = await useDB.query(q2, boardno)
        
        const count = plus[0][0].추천수


        const point = 2000
        if (count == 10) {
            const q3 = 'UPDATE 회원 JOIN 제휴매장게시판 ON 제휴매장게시판.회원_아이디 = 회원.아이디 SET 포인트 = 포인트 + ? WHERE 제휴매장게시판.글번호 = ?'
            await useDB.query(q3, [boardno, point])
            
            const q5 = 'SELECT 제휴매장게시판.회원_아이디 FROM 제휴매장게시판 WHERE 글번호 = ?';
            const [name] = await useDB.query(q5, boardno);

            const boardname = name[0]['회원_아이디']

            const pointlist = 'INSERT INTO 포인트내역 (포인트금액, 사용날짜, 구분, 회원_아이디) VALUES (?, ?, ?, ?)'
            await useDB.query(pointlist, [point, signupdate, "게시판적립" , boardname])

            const updateuserpointQuery = 'UPDATE 회원 SET 포인트 = 포인트 + ? WHERE 아이디 = ?';
            await useDB.query(updateuserpointQuery, [point, boardname]);
        }
    } else if (type === 'comment') {
        const comment = req.body.comment

        const q4 = 'INSERT INTO 댓글 (내용, 작성일자, 제휴매장게시판_글번호, 회원_아이디) VALUES (?,?,?,?)'
        await useDB.query(q4, [comment, signupdate, boardno, userid])
    }
    res.redirect(`/partnerboardlist/${boardno}`)
}

module.exports = {boarddetailView, boarddetailView2}