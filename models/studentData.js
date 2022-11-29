const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    mail: { type: "string", required: true, index: { unique: true, dropDups: true } },
    name: { type: "string", required: true },
    rollnumber: { type: "string", required: true },
    course: { type: "string", required: true },
    department: { type: "string", required: true },
    year: { type: "number", required: true },
    details: { type: 'object', required: true },
    
})

const studentData = mongoose.model("studentData", Schema)

module.exports = studentData

