const studentData = require("../models/studentData")

createStudent = (req, res) => {
    studentData.create(req.body, (err1, docs1) => {
        return res.send({ message: 'success', user: req.body.mail })
    })
}

createStudents = (req, res) => {

}

findStudent = (req, res) => {

}

findStudents = (req, res) => {

}

updateStudent = (req, res) => {
    studentData.updateOne({ mail: req.body.mail }, { $set: req.body }, (err1, docs1) => {
        res.send({ message: 'success' })
    })
}
module.exports = { createStudent, createStudents, findStudent, findStudents, updateStudent }