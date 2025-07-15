const config = require("../config/auth.config");
const { ObjectId } = require('mongodb');
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getUsersList = async (req, res, next) => {
  try {
      let { page = 1, limit = 10, sortColumn = "name", sortOrder = "asc" } = req.query;

      page = parseInt(page);
      limit = parseInt(limit);
      const sortOrderValue = sortOrder === "asc" ? 1 : -1;

      // Get total count
      const total = await User.countDocuments();

      // Fetch paginated & sorted users
      const data = await User.find()
      .sort({ [sortColumn]: sortOrderValue })
      .skip((page - 1) * limit)
      .limit(limit);

      res.json({ data, total });
  } catch (error) {
      next(error);
  }
}
exports.getUserById = async (req, res, next) =>{
  try {
      const user = await User.findById(Object(req.params.id))

      if(!user) {
          return res.status(401).json({
              success: false,
              error: `User not found with id of ${req.params.id}`
          })
      }
      res.status(200).json({
          success: true,
          data: user
      })
  } catch (error) {
      next(error)
  }
}
exports.deleteUser = async (req, res, next) => {
  try {
      const entry = await User.findById(req.params.id)

      if (!entry){
          return res.status(404).json({
              success: false,
              error: `User not found with id of ${req.params.id}`
          })
      }
      await entry.deleteOne()
      res.status(200).json({
          success: true,
          data: {}
      })
  } catch (error) {
      next(error)
  }
}

exports.createUser = async (req, res, next) => {
  try {
      if (req.file != undefined && req.file.path) {
          const filePath = req.file.path; // Path to the uploaded CSV file
          if (filePath) {
            req.body.profile_picture = filePath
          }
      }
      if(req.query.new_password == ''){
        return res.status(401).json({
          success: false,
          error: `Password is required`
      })
      }
      const hashedPassword = bcrypt.hashSync(req.body.new_password, 8)
      if(hashedPassword){
        req.body.password = hashedPassword;
      }
      const contact = await User.create(req.body)

      res.status(201).json({
          success: true,
          message: "Form submitted successfully."
      })
  
  } catch (error) {
      next(error)
  }
}
exports.updateUser = async (req, res, next) => {
  try {
      let user = await User.findById(req.params.id)

      if(!user){
          return res.status(401).json({
              success: false,
              error: `User not found with id ${req.params.id}`
          })
      }
      const userData = {
        username: req.body.username,
        email: req.body.email,
      };
      
      if(req.body.new_password != ''){
        const hashedPassword = bcrypt.hashSync(req.body.new_password, 8)
        if(hashedPassword){
          userData.password = hashedPassword;
        }
      }
      if (req.file != undefined && req.file.path) {
        const filePath = req.file.path; // Path to the uploaded CSV file
        if (filePath) {
          userData.profile_picture = filePath
        }
      }
      user = await User.findByIdAndUpdate(req.params.id, userData, {
          new: true,
          runValidators: true
      })
      const userDataArr = {
        id: user._id,
        username: user.username,
        email: user.email,
        profile_picture: user.profile_picture,
        message: 'Login successful'
      }
      res.status(200).json({
          success: true,
          data: userDataArr
      })
  } catch (error) {
      next(error)
  }
}
// Route to update user password
exports.updatePassword= async (req, res) => {
  try {
    const userId=req.params.id
    const { oldPassword, newPassword } = req.body;

    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the provided old password matches the user's current password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    // console.error('Error updating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

