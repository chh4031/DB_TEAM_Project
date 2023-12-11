const useDB = require('../../middleware/db');

// 메뉴 보여주는 컨트롤러
const menu_regView = async(req,res) => {
    return res.render('menu_reg');
};

const menu_regView2 = async(req,res) => {
    try {
        menuname = req.body.menuname;
        menuprice = req.body.menuprice;
        menucategory = req.body.menucategory;

        const currentDate = new Date();
        const menudate = currentDate.toISOString().split('T')[0];

        const insertMenuQuery = 'INSERT INTO 메뉴항목 (메뉴이름, 메뉴가격, 분류명, 등록날짜) VALUES (?, ?, ?, ?)';
        await useDB.query(insertMenuQuery, [menuname, menuprice, menucategory, menudate]);
        res.redirect('/menu');
    } catch (error) {
        console.error('메뉴 등록 중 오류 발생 : ', error);
        res.status(500).send('메뉴 등록 중 오류가 발생했습니다.');
    }
};

module.exports = {menu_regView, menu_regView2}