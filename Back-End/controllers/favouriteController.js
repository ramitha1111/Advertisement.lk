const mongoose=require('mongoose');
const favouritesModel=require('./../models/favourites');
const validateData=(req,res)=>{
    const {
        id,
        userid,
        advertisementId,
        createdAt

    }=req.body;
    if(!id){
        return res.status(400).json({message:"Id is required"});
    }
    if(!userid){
        return res.status(400).json({message:"Userid is required"});
    }
    if(!advertisementId){
        return res.status(400).json({message:"AdvertisementId is required"});
    }
    if(!createdAt){
        return res.status(400).json({message:"CreatedAt is required"});
    }
}
//create a new favourite
exports.createFavourites=async (req,res)=>{
    validateData(res,req);
    const {
        id,
        userid,
        advertisementId,
        createdAt
    }=req.body;
    const newFavourite=new favouritesModel({
        id,
        userid,
        advertisementId,
        createdAt
    });
    try{
        await newFavourite.save();
        return res.status(201).json(newFavourite);
    }
    catch (error) {
        return res.status(500).json({message:error.message});





    }

}
//get all favourites

exports.getAllFavourites=async (req,res)=>{
    try{
        const favorite=await favouritesModel.find();
        return res.status(200).json(favorite);
    }
    catch (error) {
        return res.status(500).json({message:error.message});

    }
}
//get favourites by id of the user


exports.getFavouritesById=async (req,res)=>{
    try{
        const favourite=await favouritesModel.findById(req.param('userid'));
        return res.status(200).json(favourite);
    }
    catch (error) {
        return res.status(500).json({message:error.message});


    }
}
//delete a favourite userid
exports.deleteFavourite=async (req,res)=>{
    try{
        const favourite=await favouritesModel.findByIdAndDelete(req.param('userid'));
        return res.status(200).json(favourite);
    }
    catch (error) {
        return res.status(500).json({message:error.message});

    }
}


