//MQTT Server 연결
let express = require("express");
let router = express.Router();
const mqtt = require("mqtt");
const DHT11 = require("../models/dht11")

const client = mqtt.connect("mqtt://210.183.87.114");
router.post("/led", function(req, res, next){
    res.set("Content-Type", "text/json");

    if(req.body.flag=="on") {
        client.publish("led", "1");
        res.send(JSON.stringify({led:"on"}));
    } else {
        client.publish("led", "2");
        res.send(JSON.stringify({led:"off"}));
    }
});

//안드로이드 연동하기
router.post("/device", function(req, res, next){
    if(req.body.sensor == "dht11") {
        DHT11.find({}).sort({create_at: -1}).limit(10).
        then(data=>{
            res.send(JSON.stringify(data));
        });
    } else {
        //다른 센서 정보를 전달
    }
});

//모듈을 외부에서 사용가능하도록 정의해준다.
module.exports = router;