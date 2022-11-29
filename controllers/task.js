const task = require("../models/task")
const submission = require("../models/submission")
const studentData = require("../models/studentData")
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
            for (let i = 0; i < response.submission.length; i++) {
                studentData.findOne({ rollnumber: response.submission[i].rollnumber }, (err, docs) => {
                    response.submission[i].moreDetails = docs
                    if (i == response.submission.length - 1) {
                        return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                    }
                })
            }
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
            let submissionCount = await submission.countDocuments()
            if (submissionCount > 0) {
                response.submission = true
                for (let i = 0; i < response.task.length; i++) {
                    submission.countDocuments({ taskId: response.task[i]._id }, (err, docs) => {
                        response.task[i].submissionCount = docs
                        if (i == response.task.length - 1) {
                            return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                        }
                    })
                }
            }
            else {
                return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
            }
        }
        else if (condition.role == 'student') {

            let submissionCountStudent = await submission.countDocuments({ rollnumber: condition.rollnumber })
            response.submission = true;

            for (let i = 0; i < response.task.length; i++) {
                response.task[i].submissionCount = false;
                (new Date() < new Date(response.task[i].deadline)) ? response.task[i].allow = true : response.task[i].allow = false;
                if (submissionCountStudent > 0) {
                    submission.findOne({ taskId: response.task[i]._id, rollnumber: condition.rollnumber }, (err, docs) => {
                        if (docs) {
                            let submissionStatus = docs.submittedOn
                            if (submissionStatus) { response.task[i].submissionCount = submissionStatus }
                        }
                        if (i == response.task.length - 1) {
                            res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                        }
                    }).select({ submittedOn: 1 });

                }
                else {
                    return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
                }

            }

        }
    }
    else {
        return res.send({ data: btoa((encodeURIComponent(JSON.stringify(response)))) });
    }
}

updateTask = (req, res) => {
    task.updateOne({ taskId: req.body.taskId }, { $set: req.body }, (err1, docs1) => {
        res.send({ message: 'success', user: req.body.mail, token: tokenHashed })
    })
}
module.exports = { postTask, findTask, findAllTask, updateTask } 
