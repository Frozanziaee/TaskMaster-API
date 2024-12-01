const express = require('express')
const router = express.Router()

const {
    signin,
    signup,
    forgotPassword,
    signout,
    resetPassword,
  
} = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


module.exports = router