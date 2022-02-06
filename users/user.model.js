const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true
  },
  hash:{
    type:String,
    required:true
  },
  admin:{
    type:Boolean
  },
  carts:[[{name:{type:String,required:true},quantity:{type:Number,min:1,required:true}}]]
});

module.exports = mongoose.model('User', userSchema);
