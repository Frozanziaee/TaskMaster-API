const express = require('express')
const router = express.Router()

const {
    signin,
    signup,
    forgotPassword,
    signout,
    resetPassword,
    googleLogin,
  
} = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

module.exports = router