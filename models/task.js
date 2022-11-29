const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    heading: { type: "string", required: true, index: { unique: true, dropDups: true } },
    topic: { type: "string", required: true },
    description: { type: "string" },
    level: { type: "string", required: true },
    attachments: { type: "string" },
    deadline: { type: "string", required: true },
    postedOn: { type: "string", required: true }
})



const task = mongoose.model("task", Schema)

module.exports = task

