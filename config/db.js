const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/passportauth").then(()=>{
    console.log("data bas connect done");
}).catch((e)=>{
    console.log(e.message);
})