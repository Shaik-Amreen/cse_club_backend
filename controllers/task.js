const task = require("../models/task")
const submission = require("../models/submission")
const studentData = require("../models/studentData")
const atob = require('atob')
const btoa = require('btoa')

postTask = async (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    task.create(condition, (err, docs) => {
        if (!err) {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "success" })))) });
        }
        else {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "error" })))) });
        }
    })
}

findTask = async (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    let { condition, responseDetails } = req.body
    const { role, rollnumber, _id } = condition;
    let taskId = _id;
    (role == 'student') ? condition = { _id, rollnumber, taskId } : condition = { _id, taskId }
    let response = {}
    response.task = await task.findOne(condition).select(responseDetails).lean()
    delete condition._id
    response.submission = await submission.find(condition).lean()
    if (response.submission.length > 0) {
        if (role != 'student') {
            let count = 0;
            var finalResponse = []
            let students = await studentData.find().lean();
            response.submission.forEach(async (e, i) => {
                let filterStudent = await students.filter(s => s.rollnumber == e.rollnumber)
                finalResponse = [...finalResponse, { ...e, ...{ moreDetails: filterStudent[0] } }]
                count = count + 1;
                if (count == response.submission.length) {
                    return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ task: response.task, submission: finalResponse })))) });
                }
            });
        }
        else {
            response.submission = response.submission[0]
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
        }
    }
    else {
        return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
    }
}

findAllTask = async (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    let response = { submission: false }
    response.task = await task.find().select(responseDetails).sort({ $natural: -1 }).lean()
    if (response.task.length > 0) {
        if (condition.role == 'admin') {
            let submissions = await submission.find()
            if (submissions.length > 0) {
                response.submission = true;
                let count = 0
                response.task.forEach(async (e, i) => {

                    let filterSubmission = await submissions.filter(s => s.taskId == response.task[i]._id)
                    response.task[i].submissionCount = filterSubmission.length
                    count = count + 1
                    if (count == response.task.length) {
                        await res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                    }
                });
            }
            else {
                return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
            }
        }
        else if (condition.role == 'student') {
            // task[i].submissionCount = false; if there are no submissions for particular task
            // task[i].submissionCount = submittedOn; if there are submissions for particular task
            let studentSubmission = await submission.find({ rollnumber: condition.rollnumber })
            response.submission = true;
            let count = 0
            response.task.forEach(async (e, i) => {

                await (new Date() < new Date(response.task[i].deadline)) ? response.task[i].allow = true : response.task[i].allow = false;
                if (studentSubmission.length > 0) {
                    let filterSubmission = await studentSubmission.filter(s => s.taskId == response.task[i]._id)
                    if (filterSubmission.length > 0) {
                        count = count + 1;
                        response.task[i].rating = filterSubmission[0].rating
                        response.task[i].submissionCount = filterSubmission[0].submittedOn
                    }
                    else {
                        count = count + 1;
                        response.task[i].submissionCount = false;
                    }

                    if (count == response.task.length) {
                        await res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                    }
                }
                else {
                    count = count + 1;
                    if (count == response.task.length) {
                        await res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                    }
                }


            });
        }
    }
    else {
        return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
    }
}

updateTask = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    task.updateOne(condition, { $set: responseDetails }, (err, docs) => {

        if (!err) {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "success" })))) });
        }
        else {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "error" })))) });
        }
    })
}

findTaskToEdit = (req, res) => {
    req.body = JSON.parse(decodeURIComponent(atob(req.body.data)))
    const { condition, responseDetails } = req.body
    task.findOne(condition, (err, docs) => {

        if (!err) {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify(docs)))) });
        }
        else {
            return res.send({ data: btoa((encodeURIComponent(JSON.stringify({ message: "error" })))) });
        }
    })
}


module.exports = { postTask, findTask, findAllTask, updateTask, findTaskToEdit } 
