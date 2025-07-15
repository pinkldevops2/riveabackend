// Controller function to handle image upload
exports.uploadImage = async (req, res) => {
  
    if (req.file != undefined && req.file.path) {
      const filePath = req.file.path; // Path to the uploaded CSV file
      
      
        if (filePath) {
         
            res.send({location: filePath});
      
        }else{
        res.send({ message: "Image upload failed!" });
        }
    }   
}
