const useDB = require('../../middleware/db');

// 마이페이지 화면 보여주는 컨트롤러
const mypageView = async(req, res) => {
    if(req.session.loginId){
        const userid = req.session.loginId

        const q1 = 'SELECT * FROM 회원 WHERE 아이디 = ?'
        const user = await useDB.query(q1, userid);

        const q2 = 'SELECT * FROM 회원등급결정, 회원등급 WHERE 회원등급결정.회원등급_등급명 = 회원등급.등급명 AND 회원_아이디 = ?'
        const grade = await useDB.query(q2, userid)

        let nextgrade = ''
        if (grade[0][0].회원등급_등급명 == '브론즈'){
            const q4 = `SELECT * FROM 회원등급 WHERE 등급명 = '실버'`
            nextgrade = await useDB.query(q4)
        } else if(grade[0][0].회원등급_등급명 == '실버'){
            const q4 = `SELECT * FROM 회원등급 WHERE 등급명 = '골드'`
            nextgrade = await useDB.query(q4)
        } else {
            const q4 = `SELECT * FROM 회원등급 WHERE 등급명 = '골드'`
            nextgrade = await useDB.query(q4)
        }

        const q3 = 'SELECT * FROM 분기, 회원 WHERE 회원.아이디 = ? AND 회원.로그인날짜 BETWEEN 분기.분기시작일 AND 분기.분기종료일';
        const endate = await useDB.query(q3, userid)

        return res.render('mypage' ,{user : user[0][0],
            grade : grade[0][0],
            endate : endate[0][0],
            nextgrade : nextgrade[0][0],
            loginId : req.session.loginId})
    } else {
        res.redirect('/logi');
    }
}

// 주문내역 보여주는 컨트롤러
const orderlistView = async(req, res) => {
    if(req.session.loginId) {
    const userid = req.session.loginId
    
    // 사용자의 주문 내역 가져오기
    const getOrderListQuery = 'SELECT * FROM 메뉴주문 WHERE 회원_아이디 = ?';
    const [orderRows] = await useDB.query(getOrderListQuery, userid);

    // 각 주문에 대한 세부 정보 가져오기
    const orderDetails = [];
    for (const order of orderRows) {
        const orderId = order.주문식별번호;

        // 주문된 메뉴 목록 가져오기
        const getOrderMenuQuery = `
        SELECT 메뉴주문내역.*, 메뉴항목.메뉴이름
        FROM 메뉴주문내역
        JOIN 메뉴항목 ON 메뉴주문내역.메뉴항목_메뉴항목번호 = 메뉴항목.메뉴항목번호
        WHERE 메뉴주문_주문식별번호 = ?`;
        const [orderMenuRows] = await useDB.query(getOrderMenuQuery, orderId);

        // 세부적 내용 가져오기
        const orderDetailQuery = 'SELECT * FROM 메뉴주문 WHERE 주문식별번호 = ?'
        const [orderDetailRows] = await useDB.query(orderDetailQuery, orderId);

        const orderDetail = {
            '주문날짜' : orderDetailRows[0].주문날짜,
            '주문방식' : orderDetailRows[0].주문방식,
            '제휴매장이름' : orderDetailRows[0].제휴매장이름,
            '원본총금액' : orderDetailRows[0].원본총금액,
            '할인률' : orderDetailRows[0].할인률,
            '주문내역' : orderMenuRows
        };
        orderDetails.push(orderDetail);
    }
    return res.render("orderlist",
    {loginId : req.session.loginId, orderList: orderDetails })
    } else {
        res.redirect('/logi');
    }
}

// 포인트내역 보여주는 컨트롤러
const pointlistView = async(req, res) => {
   if(req.session.loginId) {
        const userid = req.session.loginId

        const q1 = 'SELECT * FROM 포인트내역 WHERE 회원_아이디 = ?'
        const pointlist = await useDB.query(q1, userid)

        const q2 = 'SELECT * FROM 회원 WHERE 아이디 =?'
        const data = await useDB.query(q2, userid)

        return res.render("pointlist",
        {loginId : req.session.loginId,
        pointlist : pointlist[0],
        data : data[0][0]})
    } else {
        res.redirect('/logi');
    }
}
const mypartnerView = async(req, res) => {
    return res.render("/")
}

module.exports = {mypageView, orderlistView, pointlistView}