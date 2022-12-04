const Users = require("../models/users")
const nodemailer = require("nodemailer")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWTSECRET = "csewebclub"
const studentData = require('./studentData')
const randomstring = require('randomstring')
const atob = require('atob')
const btoa = require('btoa')


const encodeBuffer = (buffer) => buffer.toString("base64")
const encodeString = (string) => encodeBuffer(Buffer.from(string))
const encodeData = (data) => encodeString(JSON.stringify(data))
const encrypt = (data) => {
    if (Buffer.isBuffer(data)) return encodeBuffer(data)
    if (typeof data === "string") return encodeString(data)
    return encodeData(data)
}

exports.generateOtp = (async (req, res, next) => {
    const user = await Users.findOne({ 'mail': req.body.mail }).lean();
    let otp = randomstring.generate(4)
    req.body.otp = otp
    if (user) {
        if (user.password) {
            res.send({ message: "user is already registered" })
        }
        else {
            Users.updateOne({ 'mail': req.body.mail }, { $set: { otp: otp } }).then((err, docs) => {
                sendmail(req.body)
            })
        }
    }
    else {
        Users.create(req.body).then((err, docs) => {
            sendmail(req.body)
        })
    }

    const sendmail = (credentials) => {

        let mailTransporter = nodemailer.createTransport({
            service: "gmail.com",
            auth: {
                user: "arikya.hak@gmail.com",
                pass: "xmiluohdkbppgayk",
            },
            secureConnection: true,
            tls: {
                rejectUnauthorized: false,
                secureProtocol: "TLSv1_method",
            },
        })
        let mailDetails = {
            from: "arikya.hak@gmail.com",
            to: [credentials.mail],
            subject: `OTP ! to sign up - Webclub`,
            html: `
          <strong style="font-size:0.9rem">Greetings from Web Club ! </strong>
          <br/><br/>
          <span style="font-size:0.9rem;line-height:20px">
          Wanna enlight your future in co-orperate world ? Consider <strong> Web club </strong>
          your first priority .
          Hurry up ! don't wait .. time will never be perfect.
          <br/>
          <span><strong>OTP<strong> : ${credentials.otp}</span>
          </span>
          <br/><br/>
          Best Regards ,<br/>
          <strong>Web Club </strong> .      
          `,
        };


        mailTransporter.sendMail(mailDetails, function (err, docs) {
            res.send({ message: "success", otp: otp })
        })

    }
})




exports.register = (async (req, res, next) => {
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
    let data = await Users.findOne({ mail: req.body.mail })
    if (data) {
        if (data.password) {
            res.send({ message: 'User is already registered' })
        }
        else {
            Users.updateOne({ mail: req.body.mail }, { $set: req.body }, (err2, docs2) => {
                // res.send({ message: 'success', user: req.body.mail })

                // studentData.create(req.body, (err1, docs1) => {
                // })
                studentData.createStudent(req, res);
            })
        }
    }
    else {
        res.send({ message: 'User is not enrolled' })
    }
})

exports.findValidMail = async (req, res) => {
    const user = await Users.findOne({ 'mail': req.body.mail }).lean();
    if (user) {
        if (user.password) {
            res.send({ message: 'success' })
        }
        else {
            res.send({ message: "notEnrolled" })
        }
    }
    else {
        res.send({ error: "notRegistered" })
    }
}

exports.login = async (req, res) => {
    const { mail, password } = req.body
    const user = await Users.findOne({ 'mail': mail }).lean();
    const tokenHashed = encrypt(jwt.sign({ subject: mail }, JWTSECRET))
    if (user) {
        if (user.password) {
            (bcryptjs.compareSync(password, user.password)) ?
                (res.send({ 'token': tokenHashed, 'mail': mail, 'status': 'ok', role: user.role }))
                :
                res.send({ message: "invalidPassword" })
        }
        else { res.send({ message: "notRegistered" }) }
    }
    else {
        return res.send({ message: 'notEnrolled' })
    }
}



exports.findUsers = (req, res) => {
    Users.find((err, docs) => {
        !err
            ? res.send(docs)
            : res.send({ message: "error" })
    })
}



exports.changepassword = (req, res) => {
    passwordhashed = bcryptjs.hashSync(req.body.password, 10)
    Users.updateOne(
        { mail: req.body.mail },
        { $set: { password: passwordhashed } },
        function (err, docs) {
            if (!err && docs.nModified != 0) {
                res.send({ message: "success" })
            }
            else {
                res.send({ message: "error" })
            }
        }
    )
}

exports.forgotpassword = (req, res) => {
    Users.findOne(
        { mail: req.body.mail },
        (err, docs) => {
            if (!err && docs != null) {
                var digits = "0123456789"
                var OTP = ""
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)]
                }
                let mailDetails = {
                    from: "placementscycle@mail.com",
                    to: docs.mail,
                    subject: "Verification code - ARIKYA ",
                    html: `<p>Hey forgot password !
          <strong> ${OTP}</strong> is the your verification code . </p>
          <br/>
          <br/>
          Best Regards ,
          <br/><strong>ARIKYA</strong>`,
                }
                let mailcontent = `Hey ! ${OTP} is the OTP .`
                collectmail = { content: mailcontent, subject: mailDetails.subject }
                if (mail(mailDetails, collectmail)) { res.send({ 'error': 'Connection is poor' }) } else { res.send({ 'otp': OTP }); }
            } else {
                res.send({ error: "error" })
            }
        }
    )
}

exports.feedmail = (req, res) => {
    let mailDetails = {
        from: "Arikya",
        to: ['shaikamreenkousar@gmail.com', '19691a0559@mits.ac.in'],
        subject: `Feedback - WEBCLUB`,
        html: `${req.body.feed} by ${req.body.name} ${req.body.mail}`,
    }
    res.send(mail(mailDetails))
}
