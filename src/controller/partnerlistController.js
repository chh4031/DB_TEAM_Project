const useDB = require("../../middleware/db");

// routes/partnerlist.js 파일의 partnerlistView 함수 수정

const partnerlistView = async (req, res) => {
    try {
        let searchData = req.query.partnerSearch || '';
        let category = req.query.category || 'all'; // 카테고리 값 추
        let page = req.query.page || 1; // 현제 페이지 추가
        let itemsPerPage = 8; // 페이지당 아이템 수

        let q1;

        if (searchData === '' && category === 'all') {
            // 검색어가 없고 전체를 선택한 경우 전체 제휴매장 조회
            q1 = 'SELECT * FROM 제휴매장 WHERE 제휴매장계약활성 = "TRUE"';
        } else if (searchData !== '' && category === 'all') {
            // 검색어가 있고 전체를 선택한 경우
            q1 = 'SELECT * FROM 제휴매장 WHERE 제휴매장계약활성 = "TRUE" AND 제휴매장이름 LIKE ?';
        } else {
            // 카테고리 선택한 경우
            q1 = 'SELECT * FROM 제휴매장 WHERE 제휴매장계약활성 = "TRUE" AND 제휴매장이름 LIKE ? AND 제휴매장분류 = ?';
        }

        const data = await useDB.query(q1, [`%${searchData}%`, category]);

        return res.render('partnerlist', { 
            data: data[0], 
            searchData: searchData,
            category: category,
            currentPage : parseInt(page),
            itemsPerPage: itemsPerPage,
        });
    } catch (error) {
        console.error('제휴매장 조회 중 오류 발생 : ', error);
        res.status(500).send('제휴 매장 조회 중 오류가 발생했습니다.');
    }
};

module.exports = { partnerlistView };
