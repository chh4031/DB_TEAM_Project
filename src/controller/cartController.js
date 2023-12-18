const useDB = require('../../middleware/db');

// 메인 화면 보여주는 컨트롤러
const cartView = async(req, res) =>{
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

                // 메뉴 정보를 기반으로 장바구니 페이지에 전달
                res.render('cart', { session: req.session, cartItems: cartMenuRows,
                    loginId : req.session.loginId });
            } else {
                // 카트가 비어있는 경우
                res.render('cart', { session: req.session, cartItems: [],
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
module.exports = {cartView}