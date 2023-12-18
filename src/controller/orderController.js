const useDB = require('../../middleware/db');
const { use } = require('../router/mainRouter');

const orderView = async(req, res) =>{
    if(req.session.loginId){
        try {
            const userid = req.session.loginId;

            // 사용자의 카트 정보 불러오기
            const getCartQuery = 'SELECT * FROM 장바구니식별 WHERE 회원_아이디 = ?'
            const [cartRows] = await useDB.query(getCartQuery, [userid])

            if(cartRows.length > 0){
                const cartno = cartRows[0].장바구니식별번호;

                // 장바구니에서 각 메뉴 정보 가져오기
                const getCartMenuQuery = 'SELECT * FROM 장바구니 JOIN 메뉴항목 ON 장바구니.메뉴항목_메뉴항목번호 = 메뉴항목.메뉴항목번호 WHERE 장바구니식별_장바구니식별번호 = ?'
                const [cartMenuRows] = await useDB.query(getCartMenuQuery, [cartno])

                // 사용자 현재 보유포인트 확인
                const getuserpoint = 'SELECT * FROM 장바구니식별 JOIN 회원 ON 장바구니식별.회원_아이디 = 회원.아이디 WHERE 장바구니식별번호 = ?'
                const [userpoint] = await useDB.query(getuserpoint, [cartno])

                // 주문 총액, 주문 총 수량
                let ordertotalPrice = 0
                cartMenuRows.forEach(menuinfo => {
                    ordertotalPrice += menuinfo.장바구니총금액
                })

                // 메뉴 정보를 기반으로 장바구니 페이지에 전달
                res.render('order', { session: req.session, cartItems: cartMenuRows,
                    loginId : req.session.loginId, userpoint : userpoint[0].포인트, totalPrice: ordertotalPrice });
            } else {
                // 카트없이 접속하는 경우 
                res.render('order', { session: req.session, cartItems: [],
                    loginId : req.session.loginId });
            }
        } catch (error){
            console.error('장바구니 확인 중 오류 발생: ', error);
            res.status(500).send('장바구니 확인 중 오류가 발생했습니다.');
        }
    } else {
        res.redirect('/logi');
    }
}

const orderView2 = async(req,res) => {
    try {
        // 현재 사용자의 아이디 조회
        const userid = req.session.loginId;

        // 현재 분기
        let monthno = 0
        // 주문이나 회원 가입 시 사용하는 코드
        const currentDate = new Date();  // 실제 주문 날짜나 회원 가입 날짜를 사용해야 함

        // MySQL 쿼리를 사용하여 현재 날짜가 속하는 분기를 찾음
        const findQuarterQuery = 'SELECT 분기번호 FROM 분기 WHERE ? BETWEEN 분기시작일 AND 분기종료일';
        const [quarterResult] = await useDB.query(findQuarterQuery, [currentDate]);

        if (quarterResult.length > 0) {
        monthno = quarterResult[0].분기번호;
        } else {
        console.log('주문이나 회원 가입이 있는 분기가 아님.');
        }

        // 사용자의 장바구니 정보를 조회
        const getCartQuery = 'SELECT * FROM 장바구니식별 WHERE 회원_아이디 = ?'
        const [cartRows] = await useDB.query(getCartQuery, [userid])

        if (cartRows.length > 0) {
            // 장바구니가 비어있지 않은 경우
            const cartno = cartRows[0].장바구니식별번호;

            // 장바구니에 있는 메뉴 정보 조회
            const getCartMenuQuery = 'SELECT * FROM 장바구니 WHERE 장바구니식별_장바구니식별번호 = ?'
            const [cartMenuRows] = await useDB.query(getCartMenuQuery, [cartno]);

            // 주문 총액, 주문 총 수량
            let ordertotalPrice = 0
            let ordertotalCount = 0
            
            cartMenuRows.forEach(menuinfo => {
                ordertotalPrice += menuinfo.장바구니총금액
                ordertotalCount += menuinfo.장바구니총수량
            })

            // 주문 결제 방법, 주문 날짜
            const paymentMethod = req.body.pay;
            const currentDate = new Date();
            const signupdate = currentDate.toISOString().split('T')[0];
                
            // 사업자 번호, 할인율
            let per = 0
            let partnerno = req.body.partnerno;
            let salePrice = 0
            let partnername = ''
            let userpoint = req.body.usepoint
            const q1 = 'SELECT * FROM 제휴매장 WHERE 사업자번호 = ?'
            const [check] = await useDB.query(q1, partnerno);

            if (check.length > 0) {
                per = 5
                // 할인 가격
                salePrice = ordertotalPrice * (100-per)/100
                pointPrice = ordertotalPrice
                
                // 제휴매장 이름 조회
                partnername = check[0].제휴매장이름
            } else{
                partnerno = 999999999
                per = 0
                salePrice = ordertotalPrice
                // 사용포인트 
                pointPrice = ordertotalPrice - userpoint;
            }       

            // 포인트 적립률 정보 입력
            let usergradeinfo = ''
            const checkusergrade = `SELECT 메뉴주문.*, 회원등급결정.회원등급_등급명 FROM 메뉴주문 JOIN 회원등급결정 ON 메뉴주문.회원_아이디 = 회원등급결정.회원_아이디 WHERE 메뉴주문.회원_아이디 = '${userid}'`;
            const [usergradeinfos] = await useDB.query(checkusergrade)
            // usergradeinfos 리스트가 비어있지 않은 경우에만 실행
            if (usergradeinfos.length > 0) {
                // usergradeinfos 리스트의 맨 마지막 요소의 회원등급_등급명 값을 가져옴
                usergradeinfo = usergradeinfos[usergradeinfos.length - 1].회원등급_등급명;
            } else {
                // usergradeinfo를 undefined로 설정하거나 원하는 기본값 설정 가능
                usergradeinfo = undefined; // 또는 다른 기본값 설정
            }

            console.log(userpoint)

            let accpoint = 0
            if (userpoint > 0) {
                accpoint = 0
            } else if(usergradeinfo == "브론즈" || usergradeinfo == undefined) {
                accpoint = ordertotalPrice * 0
            } else if(usergradeinfo == "실버") {
                accpoint = ordertotalPrice * 0.03
            } else if(usergradeinfo == "골드") {
                accpoint = ordertotalPrice * 0.05
            } else {
                console.log("해당 회원은 등급이 없습니다.")
            }

            if (userpoint > 0){
                const pointlist = 'INSERT INTO 포인트내역 (포인트금액, 사용날짜, 구분, 회원_아이디) VALUES (?, ?, ?, ?)'
                await useDB.query(pointlist, [userpoint, signupdate, "사용" ,userid])
            } else {
                const pointlist = 'INSERT INTO 포인트내역 (포인트금액, 사용날짜, 구분, 회원_아이디) VALUES (?, ?, ?, ?)'
                await useDB.query(pointlist, [accpoint, signupdate, "적립" ,userid])
            }

            // 메뉴주문 테이블 정보 입력
            const insertOrderQuery = 'INSERT INTO 메뉴주문 (회원_아이디, 제휴매장이름 ,분기_분기번호, 제휴매장_사업자번호, 전체총수량, 원본총금액, 주문방식, 주문날짜, 포인트사용금액, 할인률, 전체총금액_할인, 전체총금액_포인트, 포인트적립금액) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const [orderResult] = await useDB.query(insertOrderQuery, [userid, partnername, monthno, partnerno, ordertotalCount, ordertotalPrice, paymentMethod, signupdate, userpoint, per, salePrice, pointPrice, accpoint]);

            // 여기 내가 추가함, 제휴매장에 넣기
            const insertMarketPrice = await useDB.query(`
            update 제휴매장분기별등급 set 분기별총수익 = 분기별총수익 + ?, 분기별지급액 = 분기별총수익 * 분기별등급지급률 * 0.01 where 제휴매장_사업자번호 = ? and 분기_분기번호 = ?`,[ordertotalPrice, partnerno, monthno])

            // 주문한 메뉴들을 반복하여 테이블에 저장하는 쿼리
            for (const menuItem of cartMenuRows) {
                const orderid = orderResult.insertId
                const { 메뉴항목_메뉴항목번호, 장바구니총수량, 장바구니총금액 } = menuItem;

                // 메뉴주문내역 테이블에 주문 메뉴 정보 저장
                const insertOrderlistQuery = 'INSERT INTO 메뉴주문내역 (메뉴총금액, 메뉴총수량, 환불여부, 메뉴주문_주문식별번호, 메뉴항목_메뉴항목번호) VALUES (?, ?, ?, ?, ?)'
                await useDB.query(insertOrderlistQuery, [장바구니총금액, 장바구니총수량, "false", orderid, 메뉴항목_메뉴항목번호])
                
                // 메뉴통계 정보 저장
                const checksalemenu = 'SELECT * FROM 메뉴통계 WHERE 메뉴항목_메뉴항목번호 = ? AND 분기_분기번호 = ?';
                const [existsalemenu] = await useDB.query(checksalemenu, [메뉴항목_메뉴항목번호, monthno])

                if(existsalemenu.length > 0) {
                    // 이미 통계정보가 있는 경우
                    const updatesalemenu = 'UPDATE 메뉴통계 SET 판매횟수 = 판매횟수 + ? WHERE 메뉴항목_메뉴항목번호 = ? AND 분기_분기번호 = ?';
                    await useDB.query(updatesalemenu, [장바구니총수량, 메뉴항목_메뉴항목번호, monthno])
                } else {
                    // 해당 데이터가 존재하지 않는다면
                    const updatesalemenu = 'INSERT INTO 메뉴통계 (판매횟수, 메뉴항목_메뉴항목번호, 분기_분기번호) VALUES (?, ?, ?)'
                    await useDB.query(updatesalemenu, [장바구니총수량, 메뉴항목_메뉴항목번호, monthno])
                }
            }

            // 내가 추가함(장바구니 내역 삭제 , 주문후에 삭제되어야함.)

            // 먼저 현재 유저의 장바구니 식별번호 가져오기
            const thisUser = await useDB.query(`
            select 장바구니식별번호 from 장바구니식별 where 회원_아이디 = ?`, [req.session.loginId]);

            const deleteBusket = await useDB.query(`
            delete from 장바구니 where 장바구니식별_장바구니식별번호 = ?`, [thisUser[0][0].장바구니식별번호])
            // 여기까지

            const checkgrade = 'SELECT * FROM 회원등급결정 WHERE 회원_아이디 = ?';
            const [existgradeRows] = await useDB.query(checkgrade, [userid]);

            if (existgradeRows.length > 0) {
                // 주문 완료 된 후에 회원 등급 결정 테이블 업데이트
                const updateUserGradeQuery = `UPDATE 회원등급결정
                SET
                누적사용금액 = 누적사용금액 + ?,
                누적주문횟수 = 누적주문횟수 + 1,
                회원등급_등급명 = 
                    CASE
                    WHEN 누적주문횟수 >= 40 AND 누적사용금액 >= 100000 THEN '골드'
                    WHEN 누적주문횟수 >= 20 AND 누적사용금액 >= 50000 THEN '실버'
                    ELSE '브론즈'
                    END
                WHERE 회원_아이디 = ? AND 분기_분기번호 = ?`;
                await useDB.query(updateUserGradeQuery, [ordertotalPrice, userid, monthno]);
            } else {
                // 해당 데이터가 존재하지 않는다면
                const updateUserGradeQuery = 'INSERT INTO 회원등급결정 (누적사용금액, 누적주문횟수, 분기_분기번호, 회원등급_등급명, 회원_아이디) VALUES (?, ?, ?, ?, ?)'
                await useDB.query(updateUserGradeQuery, [ordertotalPrice, 1, monthno, "브론즈", userid]);
            }

            if (userpoint > 0) {
                const updateuserpointQuery = 'UPDATE 회원 SET 포인트 = 포인트 - ? WHERE 아이디 = ?';
                await useDB.query(updateuserpointQuery, [userpoint, userid]);
            } else {
                const updateuserpointQuery = 'UPDATE 회원 SET 포인트 = 포인트 + ? WHERE 아이디 = ?';
                await useDB.query(updateuserpointQuery, [accpoint, userid]);
            }

            res.redirect('/order');
        } else {
            res.status(400).send('사용자 정보를 찾을 수 없습니다.');
        }
    } catch (error) {
        // 예외 발생 시 오류 처리
        console.error('주문 처리 중 오류 발생: ', error);
        res.status(500).send('주문 처리 중 오류가 발생했습니다.');
    }
}

const orderView3 = async (req, res) => {
    try {
        const partnerno = req.query.partnerno
        const usepoint = req.body.usepoint

        const query = 'SELECT COUNT(*) as COUNT FROM 제휴매장 WHERE 사업자번호 = ?'
        const [isCheck] = await useDB.query(query, partnerno)
        res.send({isCheck : isCheck[0].COUNT, usepoint})
    } catch(error) {
        console.error('주문 처리 중 오류 발생: ', error);
        res.status(500).send('주문 처리 중 오류가 발생했습니다.');
    }
}

module.exports = {orderView, orderView2, orderView3}