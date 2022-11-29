const task = require("../models/task")
const submission = require("../models/submission")
const studentData = require("../models/studentData")


createSubmission = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    submission.create(condition, (err, docs) => {
        if (!err) {
            return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "success" })))) });
        }
        else {
            return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "error" })))) });
        }
    })
}

createSubmissions = (req, res) => {

}

findSubmission = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    submission.find(condition, (err, docs) => {
        var response = []
        if (docs) {
            for (let i = 0; i < docs.length; i++) {
                task.findOne({ _id: docs[i].taskId }, (err1, docs1) => {
                    response = [...response, { ...docs[i]._doc, ...docs1._doc }]
                    if (i == docs.length - 1) {
                        return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: response })))) });
                    }
                }).select({ heading: 1, topic: 1, deadline: 1, _id: 0 })
            }
        }
        else {
            return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: [] })))) });
        }
    })
}

findSubmissions = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    submission.find((err, docs) => {
        var response = []
        if (docs) {
            for (let i = 0; i < docs.length; i++) {
                task.findOne({ _id: docs[i].taskId }, (err1, docs1) => {

                    studentData.findOne({ rollnumber: docs[i].rollnumber }, (err2, docs2) => {
                        response = [...response, { ...docs[i]._doc, ...docs1._doc, ...docs2._doc }]
                        if (i == docs.length - 1) {
                            return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: response })))) });
                        }
                    }).select({ _id: 0 })
                }).select({ heading: 1, topic: 1, deadline: 1, _id: 0 })
            }
        }
        else {
            return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: [] })))) });
        }
    })
}

updateSubmission = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    submission.updateOne(condition, { $set: responseDetails }, (err, docs) => {
        return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "success" })))) });
    })
}
module.exports = { createSubmission, createSubmissions, findSubmission, findSubmissions, updateSubmission }