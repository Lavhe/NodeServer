'use strict';
const nodemailer = require('nodemailer');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = 3000

const p = 567;
const host = "smtp.google.com";

app.get('/', (request, response) => {
  response.send('Hello from Express!')
});

app.post('/sendMail', (request, response) => {
    console.clear();
    console.log(request.body);
    var receiver = request.body.receiver;
    var msg = request.body.msg;
    var subject = request.body.subject;
    var from = request.body.from;
    var account = { 
        user: request.body.user,
        pass:request.body.password
    };


    try{
        sendMail(msg,subject,receiver,from,account,host,p);
    }catch(ex){

    }

    response.send({
        Success:true,
        Message:"Message sent to " + receiver
    });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
});



function sendMail(msg,subject,receiver,from,account,host,p){
    nodemailer.createTestAccount((err, account) => {

        let transporter = nodemailer.createTransport({
            host: host,
            port: p,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
    
        let mailOptions = {
            from: from, // '"Fred Foo 👻" <foo@example.com>', // sender address
            to: receiver, // 'mulavhe@gmail.com', // list of receivers
            subject: subject, //'Hello ✔', // Subject line
            text: msg,//'Hello world?', // plain text body
            html: '<b>' + msg + '</b>' // html body
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}