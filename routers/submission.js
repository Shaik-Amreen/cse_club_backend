const express = require("express")
var router = express.Router()
const submission = require("../controllers/submission")

router.post("/postSubmission", submission.createSubmission)
router.post("/updateSubmission", submission.updateSubmission)
router.post("/findSubmission", submission.findSubmission)
router.post("/findSubmissions", submission.findSubmissions)





module.exports = router


