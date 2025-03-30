const mongoose=require('mongoose');
const transactionModel=require('../models/transaction');

const validateData=(req,res)=>{
    const {
        user_id,
        package_id,
        amount
    }=req.body;
    if(!user_id){
        return res.status(400).json({message:"User_id is required"});
    }
    if(!package_id){
        return res.status(400).json({message:"Package_id is required"});
    }
    if(!amount){
        return res.status(400).json({message:"Amount is required"});
    }
}
//create a new transaction
exports.createTransaction=async (req,res)=>{
    validateData(res,req);
    const {
        user_id,
        package_id,
        amount
    }=req.body;
    const newTransaction=new transactionModel({
        id,
        user_id,
        package_id,
        amount
    });
    try{
        await newTransaction.save();
        return res.status(201).json({
            "message": "Transaction completed successfully",
            "transaction": newTransaction

            });
    }
    catch (error) {
        return res.status(500).json({message:error.message});
    }

}
//Get Transactions
exports.getAllTransaction=async (req,res)=>{
    try {
        const transactions=await transactionModel.find();
        return res.status(200).json({transactions});

    }
    catch (error) {
        return res.status(500).json({message:error.message});

    }
}
//get transaction by userid
exports.getTransactionByUserId=async (req,res)=>{
    const {user_id}=req.params;
    try {
        const transactions=await transactionModel.find({user_id:user_id});
        return res.status(200).json({transactions});

    }
    catch (error) {
        return res.status(500).json({message:error.message});

    }
}
const paypalIntegration=async (amount)=>{
    //Implementing paypal integration here



    return true;
}
//implementing transaction by paypal integration
exports.payWithPaypal=async (req,res)=>{
    const {amount}=req.body;
    if(!amount){
        return res.status(400).json({message:"Amount is required"});
    }
    try {
        //implement paypal integration here

        return res.status(200).json({message:"Payment completed successfully"});

    }
    catch (error) {
        return res.status(500).json({message:error.message});

    }
}