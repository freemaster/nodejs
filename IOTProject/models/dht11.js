const mongoose = require("mongoose"); //몽고db 연결하기
//스키마 정의(만들기)
//온도(tmp, 문자열), 습도(hum, 문자열), 날짜(create_at, 날짜)
const DHT11Schema = mongoose.Schema({
    tmp:{type:String, required:true}, //필수입력 항목
    hum:{type:String, required:true},
    create_at:{type:Date, default:Date.now}
});

//모듈을 외부에서 사용가능하게 정의
//table == model
module.exports = mongoose.model('DHT11', DHT11Schema);