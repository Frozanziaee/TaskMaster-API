const express = require('express')
const router = express.Router()

const {
    signin,
    signup,
    forgotPassword,
    logoutUser,
    resetPassword,

} = require('../controllers/auth')

router.post('/signup', signup)
router.post('/signin', signin)
router.get("/signout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router