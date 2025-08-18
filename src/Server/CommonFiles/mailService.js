"use strict";
const nodemailer = require('nodemailer');
const { renderFile } = require("ejs");
// const { resolve } = require('@angular/compiler-cli');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pankaj.singh.echelonedge@gmail.com',
        pass: 'pkxoggaclhttihwe'
    }
});

let mail = {};

mail.sendEmail = (email, options) => {
    return new Promise((respone, reject) => {
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'pankaj.singh.echelonedge@gmail.com',
                pass: 'pkxoggaclhttihwe'
            },
            secure: true,
            tls: {
                rejectUnauthorized: false
            }
        })
        const mail_configs = {
            from: 'pankaj.singh.echelonedge@gmail.com',
            to: `${email}`,
            subject: options.subject,
            html: options.html
        }
        transporter.sendMail(mail_configs, function (error, info) {
            // console.log("error, info ", error, info);
            if (error) {
                return reject({ message: "error" })
            } else {
                return resolve({ msg: "email send successfully" })
            }
        })
    })
}
module.exports = mail;