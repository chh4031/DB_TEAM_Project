const useDB = require('../../middleware/db');

// 메인 화면 보여주는 컨트롤러
const cartView = async(req, res) =>{
    return res.render("cart")
}

module.exports = {cartView}