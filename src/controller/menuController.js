const useDB = require('../../middleware/db');

// 메뉴 보여주는 컨트롤러
const menuView = async(req,res) => {
    try{
        let q1 = 'SELECT * FROM 메뉴항목'

        const data = await useDB.query(q1)

        return res.render('menu', {data: data[0], loginId : req.session.loginId})
    } catch(error){

    }
}

const cartView = async(req,res) => {
    const menuno = req.body.menuno
    const quantity = 1;
    const userid = req.session.loginId;

    // 사용자의 카트 정보 불러오기
    const getCartQuery = 'SELECT * FROM 장바구니식별 WHERE 회원_아이디 = ?';
    const [cartRows] = await useDB.query(getCartQuery, [userid]);
    // [cartRows] 안의 한행만 불러 올때 배열을 덮어서 사용

    let cartno;
    
    if(cartRows.length > 0) {
        // 이미 카트가 있는 경우
        cartno = cartRows[0].장바구니식별번호;
    } else {
        // 카트가 없는 경우 생성
        const insertCartQuery = 'INSERT INTO 장바구니식별 (회원_아이디) VALUES (?)';
        const [insertCart] = await useDB.query(insertCartQuery, [userid]);
        cartno = insertCart.insertId;
    }

        // 메뉴 정보 저장
        const getMenuInfoQuery = 'SELECT 메뉴가격 FROM 메뉴항목 WHERE 메뉴항목번호 = ?';
        const [menuRows] = await useDB.query(getMenuInfoQuery, [menuno]);

        if (menuRows.length > 0) {
            const menuprice = menuRows[0].메뉴가격

            // 장바구니 메뉴 추가 또는 수량 증가
            const getCartItemQuery = 'SELECT * FROM 장바구니 WHERE 메뉴항목_메뉴항목번호 = ? AND 장바구니식별_장바구니식별번호 = ?';
            const [cartItemRows] = await useDB.query(getCartItemQuery, [menuno, cartno]);

            if (cartItemRows.length > 0) {
                // 이미 장바구니에 있는 메뉴인 경우 수량 증가
                const updateQuantityQuery = 'UPDATE 장바구니 SET 장바구니총수량 = 장바구니총수량 + ?, 장바구니총금액 = 장바구니총금액 + ? WHERE 장바구니식별_장바구니식별번호 = ? AND 메뉴항목_메뉴항목번호 = ?';
                await useDB.query(updateQuantityQuery, [quantity, menuprice, cartno, menuno]);
            } else {
                // 새로운 메뉴인 경우 추가
                const insertMenuCartQuery = 'INSERT INTO 장바구니 (장바구니식별_장바구니식별번호, 메뉴항목_메뉴항목번호, 장바구니총수량, 장바구니총금액) VALUES (?, ?, ?, ?)';
                await useDB.query(insertMenuCartQuery, [cartno, menuno, quantity, menuprice])
            }
        }
        return res.redirect('/menu')
    }

module.exports = {menuView, cartView}