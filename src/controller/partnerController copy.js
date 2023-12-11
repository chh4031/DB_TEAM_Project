const useDB = require('../../middleware/db');

// 제휴매장 화면 보여주는 컨트롤러(사용자 시점)
const partnerView = async(req, res) =>{
    return res.render("partner")
}

module.exports = {partnerView}