const express=require("express");
const server=express();

server.get("/", (req, res)=>{
    //res.send("<h1>Hello Node.js</h1>");
    res.sendFile(__dirname+"/index.html");
}); //get방식 요청을 받을 때

server.get("/smhrd", (req, res) => {
    res.sendFile(__dirname+"/about.html");
});
//server.post(); //post방식 요청을 받을 때

//서버시작
server.listen(3000, (err)=>{
    if(err) {
        return console.log(err);
    }
    console.log("Server Running~");
});