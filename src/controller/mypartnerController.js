const useDB = require('../../middleware/db');

// 자신의 제휴매장 상세보기 컨트롤러
const mypartnerView = async(req, res) => {

    const loginId = req.session.loginId;

    // 특별승급여부 확인용
    let specialCount = []

    let money = 0;
    let goodMoney = 0;

    // 회원 아이디가 가지고 있는 제휴매장 가져오기
    const viewMypartner = await useDB.query(`
    select * from 제휴매장 where 회원_아이디 = ?`, [loginId]);

    let num = viewMypartner[0].length

    // 특별승급여부 처리
    const special = await useDB.query(`
    select 연속1등급횟수 from 제휴매장 where 회원_아이디 = ?`, [loginId])

    for(let i = 0;i < special[0].length; i++){
        if(special[0][i].연속1등급횟수 < 4){
            specialCount.push("False")
        }else{
            specialCount.push("True")
        }
    }

    console.log(viewMypartner[0][num-1].사업자번호)

    // 제휴매장 분기에 대한 정보 가져오기(최근꺼만)
    let mypartnerList = await useDB.query(`
    select * from 제휴매장분기별등급 where 제휴매장_사업자번호 = ?`, [viewMypartner[0][num-1].사업자번호])

    // console.log(mypartnerList[0])
    console.log(mypartnerList[0][num])

    // 등급에 맞는 금액 뽑기
    if(mypartnerList[0][num].분기별등급 == "3등급"){
        money = 0
    }else if(mypartnerList[0][num].분기별등급 == "2등급"){
        money = mypartnerList[0][num].분기별총수익 * 0.03
    }else if(mypartnerList[0][num].분기별등급 == "1등급"){
        money = mypartnerList[0][num].분기별총수익 * 0.05
    }else{
        money = 0
    }

    goodMoney = mypartnerList[0][num].분기별총수익 * 0.05

    // 최신 분기 가져오기
    const thisDate = await useDB.query(`
    select 분기번호 from 분기 where 분기종료일 = (select max(분기종료일) from 분기)`)

    if(mypartnerList[0][num].분기_분기번호 != thisDate[0][0].분기번호){
        mypartnerList = ["최신분기가 아님"]
    }


    return res.render("mypartner", {
        loginId : req.session.loginId,
        myPartnerList : viewMypartner[0],
        special : specialCount,
        mypartnerList : mypartnerList[0][num],
        money : money,
        goodMoney : goodMoney
    })
}

module.exports = {mypartnerView}