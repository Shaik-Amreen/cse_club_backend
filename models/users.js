const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
    mail: { type: "string", required: true, index: { unique: true, dropDups: true } },
    password: { type: "string" },
    token: { type: "string" },
    role: { type: "number" },
    otp: { type: "string", required: true },
})



const users = mongoose.model("users", Schema)

module.exports = users

