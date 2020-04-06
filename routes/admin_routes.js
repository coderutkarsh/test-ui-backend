const express = require('express')
const Router = express.Router();
const { check, body } = require('express-validator');
const {validateAdminByEmail,validateAdminLoginEmail}  = require('../models/validators')


const AdminCtrl =  require('../controllers/Admin.js')
Router.post('/addAdmin',[
   body('email')
   .isEmail()
   .withMessage('Please enter a valid email')
   .not().isEmpty()
   .custom(validateAdminByEmail),
   body('password','Password has to be valid')
   .isLength({min:5})
   .not().isEmpty()
   .trim(),
   body('phone').not().isEmpty().isNumeric(),
   body('firstName').not().isEmpty()
],AdminCtrl.addUpdateAdmin)


Router.post('/login',[
  body('password','password has to be valid')
  .isLength({min:5}) 
  .not().isEmpty()
  .trim(),
  body('email','Please enter a valid email')
   .isEmail()
   .not().isEmpty()
   .custom(validateAdminLoginEmail)
],AdminCtrl.loginAdmin)

module.exports = Router