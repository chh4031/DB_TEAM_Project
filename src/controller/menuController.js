const useDB = require('../../middleware/db');

// 메뉴 보여주는 컨트롤러
const menuView = async(req,res) => {
    try{
        let q1 = 'SELECT * FROM 메뉴항목'

        const data = await useDB.query(q1)

        return res.render('menu', {data: data[0]})
    } catch(error){

    }
}

const cartView = async(req,res) => {
    return res.redirect('/menu')
}

module.exports = {menuView, cartView}