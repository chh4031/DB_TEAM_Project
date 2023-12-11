const useDB = require('../../middleware/db');

// 제휴매장 게시판 보여주는 컨트롤러
const partnerboardView = async(req,res) => {
    return res.render('partnerboard')
}

module.exports = {partnerboardView}