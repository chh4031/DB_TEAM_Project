// 날짜 함수 정의
const time = () => {
    let today = new Date();
    
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();

    const timeObject = {
        year : year,
        month : month,
        date : date
    }
    return timeObject;
}


// 구형 버전 폐기
// node js moment 모듈로 대체

// DB의 Date 타입을 가공하는 함수
const timeChange = (newDate) => {
    const DBdata = new Date(newDate);

    const year = DBdata.getFullYear();
    const month = String(DBdata.getMonth()+1).padStart(2, '0');
    const day = String(DBdata.getDate()).padStart(2, '0');

    const TypeChange = `${year}-${month}-${day}`;
    return TypeChange;
};

module.exports = {time, timeChange}