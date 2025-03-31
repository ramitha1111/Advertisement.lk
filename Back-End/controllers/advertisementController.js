const mongoose=require('mongoose');
const advertisementModel=require('./../models/advertisement');
const validateData=(req,res)=>{
    const {
        id,
        title,
        description,
        price,
        categoryId,
        sellerId,
        location,
        images,
        videoUrl

    }=req.body;
    if(!title){
        return res.status(400).json({message:"Title is required"});
    }
    if(!description){
        return res.status(400).json({message:"Description is required"});
    }
    if(!price){
        return res.status(400).json({message:"Price is required"});
    }
    if(!categoryId){
        return res.status(400).json({message:"Category is required"});
    }
    if(!sellerId){
        return res.status(400).json({message:"Seller is required"});
    }
    if(!location){
        return res.status(400).json({message:"Location is required"});
    }
    if(!images){
        return res.status(400).json({message:"Images is required"});
    }
    if(!videoUrl){
        return res.status(400).json({message:"VideoUrl is required"});
    }
}
exports.createAdvertisement=async (req,res)=>{
    const {
        id,
        title,
        description,
        price,
        categoryId,
        sellerId,
        location,
        images,
        videoUrl

    }=req.body;
   try{
       //validate the data are existing in the request
         validateData(req,res);
       //create new advertisement
         const advertisement=new advertisementModel({
          id,
          title,
          description,
          price,
          categoryId,
          sellerId,
          location,
          images,
          videoUrl


         });
            await advertisement.save();
            res.json({message:"Advertisement created successfully"});



   }
    catch(error){
         res.status(500).json({message:"Server error",error});
    }




}
//Get advertisements by id
exports.getAdvertisements=async (req,res)=>{
    try{
        const advertisements=await advertisementModel.findById(req.params.id);

        res.status(200).json(advertisements);
    }
    catch(error){
        res.status(500).json({message:"Server error",error});
    }
}
//Get all advertisements
exports.getAllAdvertisements=async (req,res)=>{
    try{
        const advertisements=await advertisementModel.find();
        res.status(200).json(advertisements);
    }
    catch(error){
        res.status(500).json({message:"Server error",error});
    }
}
//Update advertisement

exports.updateAdvertisement=async (req,res)=>{
    const {
        id,
        title,
        description,
        price,
        categoryId,
        sellerId,
        location,
        images,
        videoUrl

    }=req.body;
    try{
        //validate the data are existing in the request
        validateData(req,res);
        //update the advertisement
        await advertisementModel.findByIdAndUpdate(req.params.id,{
            id,
            title,
            description,
            price,
            categoryId,
            sellerId,
            location,
            images,
            videoUrl
        });
        res.json({message:"Advertisement updated successfully"});
    }
    catch(error){
        res.status(500).json({message:"Server error",error});
    }
}

//Delete advertisement
exports.deleteAdvertisement=async (req,res)=>{
    try{
        await advertisementModel.findByIdAndDelete(req.params.id);
        res.json({message:"Advertisement deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:"Server error",error});
    }
}
//Get advertisements by category

exports.getAdvertisementsByCategory=async (req,res)=>{
    try{
        await advertisementModel.find({categoryId:req.params.categoryId});
        res.status(200).json(advertisements);

    }
    catch (error){
        res.status(500).json({message:"Server error",error});
    }
}
//Get advertisements by AdvertisementId
exports.getAdvertisementsByAdvertisementId=async (req,res)=>{
    try{
        await advertisementModel.find({id:req.params.id});
        res.status(200).json(advertisements);

    }
    catch (error){
        res.status(500).json({message:"Server error",error});
    }
}
//Get advertisement by search keyword within debounced search
// This is a debounced search function that waits for the user to stop typing before sending a request to the server.
// This reduces the number of requests sent to the server and improves performance.
//TODO:Ensure following code base is correct or not
exports.getAdvertisementsBySearching= async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.json({ products: [] });

        const products = await advertisementModel.find({
            $text: { $search: query }
        }).limit(10); // Optimized search with a limit

        res.json({ products });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const favourites=require('./../models/favourites');
//Get advertisements by favourite
exports.getAdvertisementsByFavourite=async (req,res)=>{
    try{
        const advertisements=await favourites.findById({userId:req.params.userId});
        res.status(200).json(advertisements);

    }
    catch (error){
        res.status(500).json({message:"Server error",error});
    }
}

