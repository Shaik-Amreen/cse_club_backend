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

// student submission tab
findSubmission = async (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    let submissions = await submission.find(condition).lean()
    if (submissions.length > 0) {
        let tasks = await task.find().select({ heading: 1, topic: 1, deadline: 1, _id: 1 }).lean()
        var response = []
        let count = 0;
        await submissions.forEach(async (e, i) => {
            let filterSubmission = await tasks.filter(s => s._id == submissions[i].taskId);
            response = [...response, { ...e, ...filterSubmission[0] }]
            count = count + 1;
            if (count == submissions.length) {
                return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: response })))) });
            }
        });
    }
    else {
        return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: [] })))) });
    }

}

// admin submission tab

findSubmissions = async (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    let submissions = await submission.find().lean()
    if (submissions.length > 0) {
        let tasks = await task.find().lean().select({ heading: 1, topic: 1, deadline: 1, _id: 1 })
        let students = await studentData.find().lean().select({ _id: 0 })
        var response = []
        let count = 0
        submissions.forEach(async (e, i) => {
            let filterTask = tasks.filter(t => t._id == e.taskId)
            let filterStudent = students.filter(s => s.rollnumber == e.rollnumber)
            response = [...response, { ...e, ...filterTask[0], ...filterStudent[0] }]
            count = count + 1;
            if (count == submissions.length) {
                return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: response })))) });

            }
        });
    }
    else {
        return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ submissions: [] })))) });
    }
}

updateSubmission = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    submission.updateOne(condition, { $set: responseDetails }, (err, docs) => {

        return res.status(200).send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "success" })))) });
    })
}
module.exports = { createSubmission, createSubmissions, findSubmission, findSubmissions, updateSubmission }