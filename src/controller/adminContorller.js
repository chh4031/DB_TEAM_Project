const useDB = require('../../middleware/db');

// 관리자 화면 보여주는 컨트롤러
const adminView = async(req, res) =>{
    return res.render("admin")
}

module.exports = {adminView}