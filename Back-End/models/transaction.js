const mongoose=require('mongoose');
const {Schema}=mongoose;


const transactionSchema=new Schema({
    user_id:{type:String,required:true},
    package_id:{type:String,required:true},
    amount:{type:Number,required:true}
});
const Transaction=mongoose.model('Transaction',transactionSchema);

module.exports=Transaction;
