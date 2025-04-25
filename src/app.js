const express=require("express");

const app=express();



app.get("/hello", (req, res)=>{
    res.send("hello");
});

app.get("/test", (req, res)=>{
    res.send("test");
});

app.listen(7777,()=>{
    console.log("Successfully started the server on port 3000....")
});

