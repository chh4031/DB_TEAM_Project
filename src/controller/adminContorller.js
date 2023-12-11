const useDB = require('../../middleware/db');

// checkmenu = 노드에서 프론트 부분 css 관리
let checkmenu = 0; 

// 관리자 화면 보여주는 컨트롤러
const adminView = async(req, res) =>{

    checkmenu = 0;

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu
    })
}

// checkmenu = 1 제휴매장관리화면 구분
// 제휴매장 관리 화면을 보여주는 컨트롤러
const mangePartner = async(req, res) =>{

    checkmenu = 1;

    // 제휴매장정보 불러오기
    const selectMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : selectMarket[0]
    })
}

// 제휴매장 관리 화면에서 검색을 할 경우 컨트롤러
const searchPartner = async(req, res) => {

    checkmenu = 1;

    const {search} = req.body;

    // 제휴매장이름 검색 컨트롤러
    const searchMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장 where 제휴매장이름 like ?`, [`%${search}%`])

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : searchMarket[0]
    })
}

// 제휴매장 관리에서 정렬할 경우 컨트롤러
const orderPartner = async(req, res) => {

    checkmenu = 1;
    
    const {search_order} = req.body;
    let orderName = ''

    // sql의 order by는 바인딩이 불가능하여 switch로 구현함.
    switch (search_order){
        case '사업자번호':
            orderName = '사업자번호 desc'
            break;
        case '재휴매장이름':
            orderName = '제휴매장이름 desc'
            break;
        default:
            orderName = '사업자번호 asc'
            break;
    }

    // 제휴매장정렬 기준 구현 쿼리, sql인젝션이나 switch 문으로 인해 보안문제없음
    const orderMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장 order by ${orderName}`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : orderMarket[0]
    })

}

// checkmenu = 1.1 제휴 매장 상세 정보
// 제휴매장 상세정보를 보여주는 컨트롤러(제휴매장관리에서 버튼으로 이동됨)
const infoDetail = async(req, res) => {

    checkmenu = 1.1

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
    })
}
module.exports = {
    adminView, 
    mangePartner, 
    searchPartner, 
    orderPartner,
    infoDetail,
}