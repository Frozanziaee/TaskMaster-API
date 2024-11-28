const express = require('express')
const router = express.Router()
const multer = require ("multer")
const storage = require ("../utils/multer-storage")

const {
  getAllUsers,
  getUser,
  updateUser,
} = require ("../controllers/users")

const upload = multer({ storage })

router.route('/').get(getAllUsers).patch(upload.single("profile"), updateUser)
router.route("/:userId").get(getUser)

module.exports = router