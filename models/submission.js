const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    taskId: { type: "string", required: true },
    rollnumber: { type: "string" },
    driveLink: { type: "string" },
    verified: { type: "Boolean" },
    rating: { type: "string" },
    submittedOn: { type: "Date" }
})


const submission = mongoose.model("submission", Schema)

module.exports = submission

