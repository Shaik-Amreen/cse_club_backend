const express = require("express")
var router = express.Router()
const task = require("../controllers/task")

router.post("/postTask", task.postTask)
router.post("/findTask", task.findTask)
router.post("/findAllTask", task.findAllTask)


module.exports = router


