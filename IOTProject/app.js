const http=require("http");
const server=http.createServer((req, res)=>{
    if(req.url==="/") {
        res.write("Node.js Server");
    } else {
        res.write("Not URL");
    }
    res.end();
});

server.listen(3000, ()=>{
    console.log("Server port 3000 is running");
});