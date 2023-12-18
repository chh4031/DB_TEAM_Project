const useDB = require('../../middleware/db');
const moment = require('moment');
const time = require("../function/time")

// 오늘날짜출력
let today = moment().format("YYYY-MM-DD")

// checkmenu = 노드에서 프론트 부분 css 관리
let checkmenu = 0; 
// 메뉴 통계 조회에서 분기별 기록 보여주는 관리
let showlog = 0

// 관리자 화면 보여주는 컨트롤러
const adminView = async(req, res) =>{

    checkmenu = 0;

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
    })
}

// checkmenu = 1 제휴매장관리화면 구분
// 제휴매장 관리 화면을 보여주는 컨트롤러
const mangePartner = async(req, res) =>{

    checkmenu = 1;

    // 제휴매장정보 불러오기
    const selectMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : selectMarket[0]
    })
}

// 제휴매장 관리 화면에서 검색을 할 경우 컨트롤러
const searchPartner = async(req, res) => {

    checkmenu = 1;

    const {search} = req.body;

    // 제휴매장이름 검색 컨트롤러
    const searchMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장 where 제휴매장이름 like ?`, [`%${search}%`])

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : searchMarket[0]
    })
}

// 제휴매장 관리에서 정렬할 경우 컨트롤러
const orderPartner = async(req, res) => {

    checkmenu = 1;
    
    const {search_order} = req.body;
    let orderName = ''

    // sql의 order by는 바인딩이 불가능하여 switch로 구현함.
    switch (search_order){
        case '사업자번호':
            orderName = '사업자번호 desc'
            break;
        case '재휴매장이름':
            orderName = '제휴매장이름 desc'
            break;
        default:
            orderName = '사업자번호 asc'
            break;
    }

    // 제휴매장정렬 기준 구현 쿼리, sql인젝션이나 switch 문으로 인해 보안문제없음
    const orderMarket = await useDB.query(`
    select 사업자번호, 제휴매장이름, 제휴매장계약활성, 제휴매장요청유무 from 제휴매장 order by ${orderName}`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        selectMarket : orderMarket[0]
    })

}

// checkmenu = 1.1 제휴 매장 상세 정보
// 제휴매장 상세정보를 보여주는 컨트롤러(제휴매장관리에서 버튼으로 이동됨)
const infoDetail = async(req, res) => {

    checkmenu = 1.1

    // 현재 제휴매장의 사업자번호 가져오기
    const marketNum = req.query.marketNum;

    // 현재 제휴매장의 상세정보 가져오기
    const marketInfo = await useDB.query(`
    select * from 제휴매장 where 사업자번호 = ?`, [marketNum])

    let newMarket = "False"

    if(marketInfo[0][0].제휴매장재계약유무 == "False" && marketInfo[0][0].총계약일수 < 8){
        newMarket = "True"
    }else{
        newMarket = "False"
    }

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        marketInfo : marketInfo[0][0],
        newMarket : newMarket
    })
}

// 제휴매장 계약활성 누를시
const On = async(req, res) => {

    checkmenu = 1.1

    const marketNum = req.query.marketNum

    // 제휴매장 계약활성 업데이트
    const updateOn_1 = await useDB.query(`
    update 제휴매장 set 제휴매장계약활성 = "True" where 사업자번호 = ?`, [marketNum])

    // 제휴매장 계약요청여부 업데이트
    const updateOn_2 = await useDB.query(`
    update 제휴매장 set 제휴매장요청유무 = "False" where 사업자번호 = ?`, [marketNum])


    return res.redirect(`infoDetail?marketNum=${marketNum}`)
}

// 제휴매장 계약비활성 누를시
const Off = async(req, res) => {
    
    checkmenu = 1.1

    const marketNum = req.query.marketNum
    
    const updateOff_1 = await useDB.query(`
    update 제휴매장 set 제휴매장계약활성 = "False" where 사업자번호 = ?`, [marketNum])

    
    // 제휴매장 계약요청여부 업데이트
    const updateOff_2 = await useDB.query(`
    update 제휴매장 set 제휴매장요청유무 = "False" where 사업자번호 = ?`, [marketNum])

    return res.redirect(`infoDetail?marketNum=${marketNum}`)
}

// 제휴매장정보상세에서 저장 버튼을 누를시
const updateInfo = async(req, res) => {

    checkmenu = 1.1

    const {marketNumber, deteleWhy} = req.body;

    const updateInfo = await useDB.query(`
    update 제휴매장 set 계약해지사유 = ? where 사업자번호 = ?`, [deteleWhy, marketNumber]);

    return res.redirect(`infoDetail?marketNum=${marketNumber}`)
}

// checkmenu = 1.2 제휴 매장 분기 정보 확인
// 제휴매장관리에서 분기정보확인을 누를시
const DateDetail = async(req, res) => {

    checkmenu = 1.2

    // 현재 제휴매장의 사업자번호 가져오기
    const marketNum = req.query.marketNum;

    // 현재 제휴매장의 상세정보 가져오기
    const marketInfo = await useDB.query(`
    select * from 제휴매장 inner join 제휴매장분기별등급 on 제휴매장.사업자번호 = 제휴매장분기별등급.제휴매장_사업자번호 where 사업자번호 = ?`, [Number(marketNum)])

    // console.log(marketInfo[0].length)

    // 분기정보 없을때 예외처리
    if(marketInfo[0].length == 0){
        return res.send('<script type = "text/javascript">alert("분기정보 없음"); location.href="/admin/mangePartner";</script>')
    }else{
        return res.render("admin", {
            loginId : req.session.loginId,
            checkmenu : checkmenu,
            marketInfo : marketInfo[0],
        })
    }
}

// 제휴 매장 분기 정보에서 저장(지급률저장)을 누를시
const updateDate = async(req, res) =>{

    checkmenu = 1.2

    // dateNum = 분기별등급식별번호
    // giveP = 바뀐 지급률
    // totalMoney = 총금액
    // marketNumber = 사업자번호
    const {dateNum, giveP, totalMoney, marketNumber} = req.body
    
    // 지급률 업데이트에 따른 다른 정보들도 업데이트
    const updateMarket = await useDB.query(`
    update 제휴매장분기별등급 set 분기별등급지급률 = ?, 분기별지급액 = ?, 관리자부여등급혜택여부 = ? where 분기별등급식별번호 = ?`, [giveP, totalMoney * giveP * 0.01, "True", dateNum])

    return res.redirect(`infoDate?marketNum=${marketNumber}`)
}
// 제휴 매장 분기에서 메시지 보내기
const sendMessage = async(req, res) => {

    checkmenu = 1.2

    // dateNum = 제휴 매장 분기별 등급 식별번호
    // marketNumber = 제휴 매장 사업자 번호
    // message = 메시지내용

    const {dateNum, marketNumber, message} = req.body

    const saveMessage = await useDB.query(`
    insert into 제휴매장메시지(메시지내용, 작성날짜, 제휴매장분기별등급_분기별등급식별번호, 제휴매장_사업자번호) values(?,?,?,?)`, [message, today, dateNum, marketNumber])

    return res.redirect(`infoDate?marketNum=${marketNumber}`)
}

// 메시지 기록 보는 컨트롤러
const messageDetail = async(req, res) => {
    
    checkmenu = 1.3

    let DateChange = []
    const {marketNum, marketDate} = req.query

    // 현재 제휴매장의 상세정보 가져오기
    const marketInfo = await useDB.query(`
    select * from 제휴매장 where 사업자번호 = ?`, [marketNum])

    // 현재 제휴매장의 메시지 기록 가져오기
    const selectMessage = await useDB.query(`
    select 작성날짜, 메시지내용 from 제휴매장메시지 where 제휴매장_사업자번호 = ?`, [marketNum])

    for(let i = 0; i < selectMessage[0].length; i++){
        DateChange.push(time.timeChange(selectMessage[0][i].작성날짜))
    }

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        marketInfo : marketInfo[0],
        selectMessage : selectMessage[0],
        DateChange : DateChange
    })
}

// 회원 등급 수정 컨트롤러
const userGrade = async(req, res) => {

    checkmenu = 2

    // 회원 등급 정보 가져오기
    const userGrade = await useDB.query(`
    select * from 회원등급 order by 포인트지급률 desc`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        usergrade : userGrade[0]
    })
}

// 회원 등급 수정 및 추가시 컨트롤러
const usergradeupdate = async(req, res) => {

    checkmenu = 2

    // 추가 버튼인지 저장 버튼인지 구분용
    // btn = 0 추가
    // btn = 1 저장(수정용)
    const {del, btn, gradeInsert, gradeName, orderCount, orderMoney, percent} = req.body

    // console.log(del, btn)
    const btnNum = Number(btn)
    const delNum = Number(del)

    if(btn == "0" && del == undefined){
        // 빈 등급 하나 추가
        try{
            const addgrade = await useDB.query(`
            insert into 회원등급(등급명, 포인트지급률, 기준주문횟수, 기준주문금액) values(?,?,?,?)`, [gradeInsert,0,0,0])
        }catch{
            // 추가 두번 누를시 예외처리
            return res.send(`<script type = "text/javascript">alert("이미 추가된 등급이 있거나, 회원등급명이 중복됩니다."); location.href="/admin/usergrade";</script>`)
        }
    }else if(del == undefined){
        // 수정된 회원등급 반영
        try{
            const updategrade = await useDB.query(`
            update 회원등급 set 포인트지급률 = ?, 기준주문횟수 = ?, 기준주문금액 = ? where 등급명 = ?`, [percent[btnNum], orderCount[btnNum], orderMoney[btnNum], gradeName[btnNum]])
        }catch{
            return res.send(`<script type = "text/javascript">alert("잘못된 값 발생하였습니다."); location.href="/admin/usergrade";</script>`)
        }
    }else{
        // 회원 등급 삭제
        try{
            const deletegrade = await useDB.query(`
            delete from 회원등급 where 등급명 = ?`, [gradeName[delNum]])
        }catch{
            return res.send(`<script type = "text/javascript">alert("삭제중 오류가 발생하였습니다."); location.href="/admin/usergrade";</script>`)
        }
    }

    // 회원 등급 정보 가져오기
    const userGrade = await useDB.query(`
    select * from 회원등급 order by 포인트지급률 desc`)

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        usergrade : userGrade[0]
    })
}

// 메뉴 통계 조회 컨트롤러
const menuinfo = async(req, res) => {

    checkmenu = 3
    showlog = 0
    
    // 날짜 가공 배열
    let DateChange = []
    // 총수익 계산 배열
    let totalMoney = []
    // 메뉴항목번호 배열
    let menuList = []
    // 메뉴통계를 통한 총 금액 배열
    let totalList = []

    // 메뉴 통계를 위해 join(메뉴항목이랑 메뉴통계), 그리고 총금액은 서버에서 처리..
    const menuInfo = await useDB.query(`
    select * from 메뉴항목`)

    // 총 판매갯수 업데이트(연동이 안되서 업데이트 필요)
    // 메뉴항목번호 배열부터 만들기
    for(let i = 0; i < menuInfo[0].length; i++){
        menuList.push(menuInfo[0][i].메뉴항목번호)
    }

    // 메뉴통계에서 판매횟수 더하기
    for(let i = 0;i < menuList.length;i++){
        const sumMenu = await useDB.query(`
        select SUM(판매횟수) as 총수 from 메뉴통계 where 메뉴항목_메뉴항목번호 = ?`, [menuList[i]])

        totalList.push(sumMenu[0][0])

        const updateCount = await useDB.query(`
        update 메뉴항목 set 총판매갯수 = ? where 메뉴항목번호 = ?`, [totalList[i].총수, menuList[i]])
    }

    // 날짜가공
    for(let i = 0; i < menuInfo[0].length; i++){
        DateChange.push(time.timeChange(menuInfo[0][i].등록날짜))
    }

    // 총수익 계산 (코드에서 처리)
    for(let i = 0; i < menuInfo[0].length; i++){
        totalMoney.push(menuInfo[0][i].총판매갯수 * menuInfo[0][i].메뉴가격)
    }

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        menuInfo : menuInfo[0],
        DateChange : DateChange,
        totalMoney : totalMoney,
        showlog : showlog
    })
}

// 메뉴통계 검색 컨트롤러
const menuInfoSearch = async(req, res) => {
    
    checkmenu = 3
    showlog = 0

    // 날짜 가공 배열
    let DateChange = []
    // 총수익 계산 배열
    let totalMoney = []

    const {search} = req.body;

    const menuSearch = await useDB.query(`
    select * from 메뉴항목 where 메뉴이름 like ?`, [`%${search}%`])

    // 날짜가공
    for(let i = 0; i < menuSearch[0].length; i++){
        DateChange.push(time.timeChange(menuSearch[0][i].등록날짜))
    }

    // 총수익 계산 (코드에서 처리)
    for(let i = 0; i < menuSearch[0].length; i++){
        totalMoney.push(menuSearch[0][i].총판매갯수 * menuSearch[0][i].메뉴가격)
    }

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        menuInfo : menuSearch[0],
        DateChange : DateChange,
        totalMoney : totalMoney,
        showlog : showlog
    })
}

// 메뉴통계 정렬 컨트롤러
const menuInfoOrder = async(req, res) => {

    checkmenu = 3
    showlog = 0

    // 날짜 가공 배열
    let DateChange = []
    // 총수익 계산 배열
    let totalMoney = []
    // case 문 사용을 위한 변수선언(인젝션 방지)
    let orderName = ""

    const {search_order} = req.body

    switch (search_order){
        case '메뉴이름':
            orderName = '메뉴이름 desc'
            break;
        case '총판매갯수':
            orderName = '총판매갯수 desc'
            break;
        default:
            orderName = '총수익 asc'
            break;
    }
    let menuSearch = undefined

    if (orderName != "총수익 asc"){
        menuSearch = await useDB.query(`
        select * from 메뉴항목 order by ${orderName}`)
    }else{
        menuSearch = await useDB.query(`select *, 총판매갯수 * 메뉴가격 as totalmoney from 메뉴항목 order by totalmoney desc`)
    }

    // 날짜가공
    for(let i = 0; i < menuSearch[0].length; i++){
        DateChange.push(time.timeChange(menuSearch[0][i].등록날짜))
    }

    // 총수익 계산 (코드에서 처리)
    for(let i = 0; i < menuSearch[0].length; i++){
        totalMoney.push(menuSearch[0][i].총판매갯수 * menuSearch[0][i].메뉴가격)
    }

    return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        menuInfo : menuSearch[0],
        DateChange : DateChange,
        totalMoney : totalMoney,
        showlog : showlog
    })
}

// 메뉴 통계 조회에서 선택, 삭제, 수정 작업 컨트롤러
const selectJob = async(req, res) => {

    checkmenu = 3

    // selectBtn = 작업 선택
    // 0 = 분기별기록 보여주기
    // 1 = 수정
    // 2 = 삭제
    // menuNum = 넘어오는 메뉴 항목 번호
    // menuPrice = 해당 메뉴 가격

    // mName = 메뉴이름
    // menuGood = 특별메뉴

    const {selectBtn, menuPrice, mName, menuGood} = req.body;
    const {menuNum} = req.query;

    // render를 위해서 필요한 부분들(위에꺼 그대로 쓰긴함.)
    // 날짜 가공 배열
    let DateChange = []
    // 총수익 계산 배열
    let totalMoney = []
    // 메뉴항목에 맞는 총 수익 계산
    let logMoney = []

    // 메뉴 통계를 위해 join(메뉴항목이랑 메뉴통계), 그리고 총금액은 서버에서 처리..
    const menuInfo = await useDB.query(`
    select * from 메뉴항목`)

    // 날짜가공
    for(let i = 0; i < menuInfo[0].length; i++){
        DateChange.push(time.timeChange(menuInfo[0][i].등록날짜))
    }

    // 총수익 계산 (코드에서 처리)
    for(let i = 0; i < menuInfo[0].length; i++){
        totalMoney.push(menuInfo[0][i].총판매갯수 * menuInfo[0][i].메뉴가격)
    }

    // 각 작업에 맞게 진행
    if(selectBtn == "0"){

        // 분기별 기록 보여주기
        showlog = 1

        // 메뉴 통계 가져오기
        const menulog = await useDB.query(`
        select * from 메뉴통계 where 메뉴항목_메뉴항목번호 = ?`, [menuNum])

        // 메뉴 이름 가져오기
        const menuName = await useDB.query(`
        select 메뉴이름 from 메뉴항목 where 메뉴항목번호 = ?`, [menuNum])

        // 메뉴 가격 계산
        for(let i = 0; i < menulog[0].length; i++){
            logMoney.push(menulog[0][i].판매횟수 * menuPrice)
        }

        return res.render("admin", {
        loginId : req.session.loginId,
        checkmenu : checkmenu,
        menuInfo : menuInfo[0],
        DateChange : DateChange,
        totalMoney : totalMoney,
        menulog : menulog[0],
        menuName : menuName[0][0].메뉴이름,
        logMoney : logMoney,
        showlog : showlog
    })
    }else if(selectBtn == "1"){

        showlog = 0

        // 수정
        const updateMenu = await useDB.query(`
        update 메뉴항목 set 메뉴이름 = ?, 메뉴가격 = ?, 특별메뉴 = ? where 메뉴항목번호 = ?`, [mName, menuPrice, menuGood, menuNum])

        // 다시 조회(input 재반영 늦는거 해결)
        const menuInfo_1 = await useDB.query(`
        select * from 메뉴항목`)

        return res.render("admin", {
            loginId : req.session.loginId,
            checkmenu : checkmenu,
            DateChange : DateChange,
            totalMoney : totalMoney,
            showlog : showlog,
            menuInfo : menuInfo_1[0],
        })

    }else{

        showlog = 0

        // 삭제, 이거 외래키 cascade함 중요함!!!
        // 메뉴항목_메뉴항목번호 이거 cascade!!!
        const deleteMenu = await useDB.query(`
        delete from 메뉴항목 where 메뉴항목번호 = ?`,[menuNum])

        // 다시 조회(input 재반영 늦는거 해결)
        const menuInfo_1 = await useDB.query(`
        select * from 메뉴항목`)

        return res.render("admin", {
            loginId : req.session.loginId,
            checkmenu : checkmenu,
            DateChange : DateChange,
            totalMoney : totalMoney,
            showlog : showlog,
            menuInfo : menuInfo_1[0],
        })
    }


}
module.exports = {
    adminView, 
    mangePartner, 
    searchPartner, 
    orderPartner,
    infoDetail,
    On,
    Off,
    updateInfo,
    DateDetail,
    updateDate,
    sendMessage,
    messageDetail,
    userGrade,
    usergradeupdate,
    menuinfo,
    menuInfoSearch,
    menuInfoOrder,
    selectJob
}

// const menuInfo = await useDB.query(`
//     select * from 메뉴항목 inner join 메뉴통계 on 메뉴항목.메뉴항목번호 = 메뉴통계.메뉴항목_메뉴항목번호`)