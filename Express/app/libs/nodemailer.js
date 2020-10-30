const nodeMailer = require('nodemailer');

  // create reusable transporter object using the default SMTP transport
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'techblogs007@gmail.com', // generated ethereal user
      pass: '8296731080@SDMcet' // generated ethereal password
    }
  });

  let mailOptions = {
    from: '"MY-TO-DO-LIST" techblogs007@gmail.com',
    to: '',
    subject: '',
    html:''
};

  let autoEmail = (reciever, message, subject) =>{

    mailOptions.to = reciever;

    mailOptions.html = message;

    mailOptions.subject = subject;

    transporter.sendMail(mailOptions, function(err, info){
        if(err){
         
            console.log(err);
        }else{
            console.log('mail Sent ' + info.response);
        }
    });

}//end autoEmail

module.exports = {
    autoEmail: autoEmail
}

