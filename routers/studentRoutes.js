const express = require('express')
var router = express.Router()

const student = require('../controllers/studentData')

router.post('/findStudent',student.findStudent);
router.post('/updateStudent',student.updateStudent);

module.exports = router