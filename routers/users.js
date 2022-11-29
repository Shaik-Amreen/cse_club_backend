const express = require("express")
var router = express.Router()
const users = require("../controllers/users")

router.post("/generateOtp", users.generateOtp)
router.post("/register", users.register)
router.post("/login", users.login)

module.exports = router


