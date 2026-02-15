const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 firebaseUid:{
   type:String,
   required:true
 },

 displayName:{
    type:String,
    required:true
 },
 photoUrl:
 {
   type:String
 },
firstName:
{
   type:String,
   required:true
},
lastName:
{
   type:String,
   required:true
},
 
Email:{
    type:String,
    required:true
 },

},
{timestamps:true});

module.exports = mongoose.model("User", userSchema);