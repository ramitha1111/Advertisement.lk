//Import the required modules
const categories=require('./category');
const mongoose=require('mongoose');
const {Schema}=mongoose;
//Create a schema
const advertisementSchema=new Schema({
    id:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    categoryId:{type:String,required:true},
    sellerId:{type:String,required:true},
    location:{type:String,required:true},
    images:{type:String,required:true},
    videoUrl:{type:String,required:true},
    isBoosted:{type:String,required:true},
    views:{type:String,required:true},
    status:{type:String,required:true},
    createdAt:{type:Date,required:true},
    updatedAt:{type:Date,required:true}


})
//Create a model
const Advertisement=mongoose.model('Advertisement',advertisementSchema);
//Export the model
module.exports=Advertisement;


