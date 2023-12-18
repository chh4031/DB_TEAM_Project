const useDB = require('../../middleware/db');

const partnerboardlistView = async(req, res) => {
    q1 = 'SELECT * FROM 제휴매장게시판'
    const data = await useDB.query(q1)

    let page = req.query.page || 1; // 현제 페이지 추가
    let itemsPerPage = 8; // 페이지당 아이템 수

    return res.render('partnerboardlist', {
        loginId : req.session.loginId,
        data : data[0],
        currentPage : parseInt(page),
        itemsPerPage: itemsPerPage
    })
}

module.exports = {partnerboardlistView};