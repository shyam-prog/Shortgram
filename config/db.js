const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();


url="mongodb+srv://shyammodha14:3Q2olVPrhK8ShhWi@cluster0.ckqe7mc.mongodb.net/test";


mongoose.connect(url , (err)=>{
if (err)
{
    console.log(err)
}
else
{
    console.log("connected Success")
}

} )
