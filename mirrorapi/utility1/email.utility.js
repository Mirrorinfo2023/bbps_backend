const nodemailer = require('nodemailer');



// Email options


// Send the email
function send_mail(to, subject, message) {

    // Create a transporter using SMTP
            const transporter = nodemailer.createTransport({
                host: 'mail.mirrorinfo.in',
                port: 587, 
                secure: true,
                auth: {
                    user: 'mirrorupdate@mirrorinfo.in',
                    pass: 'Mirror@#1996',

                }
            });

            const mailOptions = {
                from: 'mirrorupdate@mirrorinfo.in',
                to,
                subject,
                text:message
            };

            return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {

                console.log(info);
                // console.log()
                if (error) {
                    console.error('Error sending email:', error);
                    reject(error);
                } else {
                    console.log('Email sent:', info.response);
                    resolve(info.response);
                }

            });
        });
}

module.exports = {
    
    send_mail
  

};