const useDB = require('../../middleware/db');

const partnerdetailView = async (req, res) => {
    const partnerno = req.params.business_number;
    const q1 = 'SELECT * FROM 제휴매장 WHERE 사업자번호 = ?';

    try {
        const result = await useDB.query(q1, [partnerno]);

        if (result[0].length > 0) {
            res.render('partnerdetail', { data: result[0][0] });
        } else {
            // 주어진 사업자 번호에 대한 데이터가 없는 경우
            res.status(404).send('제휴매장을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('제휴매장 조회 중 오류 발생 : ', error);
        res.status(500).send('제휴 매장 조회 중 오류가 발생했습니다.');
    }
};

module.exports = {partnerdetailView}