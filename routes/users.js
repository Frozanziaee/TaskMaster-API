const express = require('express')
const router = express.Router()
const multer = require ("multer")
const storage = require ("../utils/multer-storage.js")

const {
  getAllUsers,
  getUser,
  updateUser,
} = require ("../controllers/users.js")

const upload = multer({ storage })

router.route('/').get(getAllUsers).patch(upload.single("profile"), updateUser)
router.route("/:id").get(getUser)

module.exports = router