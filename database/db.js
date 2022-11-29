const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/cseclub",
    {
        useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true
    }).then((result) => {
        console.log('Mongodb connection succeeded')
    }).catch((err) => {
        console.log('error while connecting Mongodb' + err)
    })
