const mongoose= require('mongoose');

const connectDB =async()=>{
    await mongoose.connect("mongodb+srv://salaniteesh:Chintu02@node.uoztyqn.mongodb.net/devConnect");
};
module.exports=connectDB;
