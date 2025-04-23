//Import the required modules
const categories=require('./category');
const mongoose=require('mongoose');
const {Schema}=mongoose;
//Create a schema
const advertisementSchema=new Schema({

    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    categoryId:{type:String,required:true},
    subcategoryId:{type:String,required:true},
    features:[{type:String}],
    userId:{type:String,required:true},
    location:{type:String,required:true},
    featuredImage:{type:String,required:true},
    images:[{type:String}],
    videoUrl:{type:String,required:true},
    isVisible:{type:Number,required:true},
    isBoosted:{type:Number,required:true},
    packageId:{type:String},
    boostedUntil: { type: Date },
    views:{type:String,required:true},
    status:{type:String,required:true},
    createdAt:{type:Date,required:true},
    updatedAt:{type:Date,required:true}

})

//Create a model
const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);

//Export the model
module.exports=Advertisement;

