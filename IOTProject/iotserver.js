const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const http = require("http");
const mongoose = require("mongoose");
//devices.js에서 생성한 모듈 불러오기
const devicesRouter = require("./routes/devices");

const DHT11 = require("./models/dht11");
const { isObject } = require("util");

require("dotenv").config({path:"variables.env"});
//html 경로를 static에 넣어서 관리
app.use(express.static(__dirname+"/public")); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/devices", devicesRouter);

//MQTT 접속하기
const client = mqtt.connect("mqtt://210.183.87.114");
client.on("connect", ()=>{
    console.log("Mqtt connect");

    //수신자를 등록
    client.subscribe("dht11");
});

//topic라는 정보로 데이터를 확인
client.on("message", async(topic, message)=>{
    let obj=JSON.parse(message);
    let date=new Date();
    let year=date.getFullYear();
    let month=date.getMonth();
    let today=date.getDate();
    let hours=date.getHours();
    let minutes=date.getMinutes();
    let seconds=date.getSeconds();
    obj.create_at=new Date(Date.UTC(year, month, today, hours, minutes, seconds));

    const dht11=new DHT11({
        tmp:obj.tmp,
        hum:obj.hum,
        create_at:obj.create_at
    });

    //mongodb에 저장하기
    try{
        const saveDHT11=await dht11.save();
        console.log("insert OK");
    } catch (error) {
        console.log({message:error});
    }

    console.log(obj);
});

//webserver 구축
app.set("port", "3000");
let server=http.createServer(app);
//ip, port : socket(소켓)
let io = require("socket.io")(server);
io.on("connection", (socket)=>{
    socket.on("socket_evt_mqtt", function(data){
        DHT11.find({}).sort({_id:-1}).limit(1).then(data=>{
            socket.emit("socket_evt_mqtt", JSON.stringify(data[0]));
        });
    });
});

server.listen(3000, 
    (err)=>{
        if(err) {
            return console.log(err);
        } else {
            console.log("server ready~");

            //DB connection 
            mongoose.connect(process.env.MONGODB_URL, 
                {
                    useNewUrlParser:true, 
                    useUnifiedTopology:true
                }, 
                ()=>{
                    console.log("connected to DB!");
                }
            );
        }
    }
);