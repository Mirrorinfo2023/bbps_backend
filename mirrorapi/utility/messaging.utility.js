const { connect,baseurl } = require('../config/db.config');
require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
const pdf = require('html-pdf');


const messaging = async (itemDiscription, billingAddress, paymentDetails, messages) => {
    try {
        
        const toEmail = billingAddress.email;
        let pdfPath = null;

        if(billingAddress.invoice_no && billingAddress.invoice_date)
        {
            pdfPath = await generate_invoice(itemDiscription, billingAddress, paymentDetails);
        }

        const subject = itemDiscription.item_name;
        const textMessage = messages.email;
        const emailInfo = await sendEmail(toEmail, subject, textMessage, pdfPath);
        return {'status': true, 'email_data': emailInfo};
    } catch (error) {
        console.error('Error:', error);
        return {'status': false, 'email_data': error};
    }
}

const sendEmail = async (toEmail, subject, textMessage, pdfPath) => {
    let transporter = nodemailer.createTransport({
        host: process.env.HOST, // SMTP server address (e.g., smtp.mirrorinfo.in)
        port: process.env.PORT, // Port (usually 587 for TLS or 465 for SSL)
        secure: process.env.SECURE, // Set to true if you're using port 465
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    

    let mailOptions = {
        from: `"${process.env.COMPANY_NAME}" <${process.env.EMAIL_USER}>`, 
        to: toEmail,
        subject: subject,
        text: textMessage,
        html: `<b>${textMessage}</b>`
    };

    if (pdfPath) {
        mailOptions.attachments = [
            {
                filename: path.basename(pdfPath),
                path: pdfPath, // Path to the PDF file
                contentType: 'application/pdf'
            }
        ];
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
};

// const sendVoiceCall = async (mobile) => {
//     return new Promise((resolve, reject) => {
//         let apiUrl = `http://login5.spearuc.com/MOBILE_APPS_API/voicebroadcast_api.php?type=broadcast&user=JOBBERSHUB&pass=Yash@#123`;
//         const recordedFile = path.join(__dirname, 'uploads/21903_4_20240312102356.mp3'); // Path to your audio file;
//         const callRepeat = 30;
//         apiUrl += `&recorded_file=${encodeURIComponent(recordedFile)}&call_repeat=${callRepeat}&reconnects_interval=30&to_numbers=${mobile}`;
        
//         axios.get(apiUrl) 
//             .then((response) => {
//                 resolve({ result: response.data}); 
//                 // if(response.data.status == 'SUCCESS' || response.data.status == 'PROCESS')
//                 // {
//                 //     resolve({ result: response.data}); 
//                 // }else{
//                 //     reject({ result: response.data}); 
//                 // }
                
//             })
//             .catch((error) => {
//                 console.log(error);
//                 reject(error); 
//             });
            
//     });
// };



const generate_invoice = async (itemDiscription, billingAddress, paymentDetails) => {
    
    try{
      const { name='', mobile='', email='', mlm_id, invoice_no, invoice_date } = billingAddress;
      const { item_name='', unit='', amount='', order_id='' } = itemDiscription;
      const { gateway='', bank_ref_no='', tracking_id='', payment_date } = paymentDetails;

      const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Typography Example</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 50px;
                    font-size: 18px;
                }
                .paragraph {
                    margin-bottom: 20px;
                    font-size: 12px;
                }
                .box_wrapper{
                    box-shadow: 1px 0px 5px grey;
                    padding: 10px;
                }
                .serif {
                    font-family: "Times New Roman", Times, serif; /* Serif font family */
                }

                .table th, .table td {
                    padding: 15px;
                    text-align: left;
                }

                .table1 th, .table1 td {
                    border: 1px solid #eee
                }

    
                .container {
                    width: 100%;
                    overflow: hidden;
                    }
                    .left-section {
                    display:inline-block;
                    width: 500px; /* Adjust as needed */
                    }
                    .right-section {
                    display:inline-block;
                    width: 300; /* Adjust as needed */
                    }
            </style>
            </head>
            <body>
                <div class="container"> 
                    <table width='100%'>
                        <tr>
                            <td width="500" align="center"><img src="${baseurl}/uploads/logo.png" width="80" height="80"/><br/>
                        </tr>
                    </table>
                    <br/>
                    <table width='100%'>
                        <tr>
                            <td width='50%' align='left'><p>Invoice<b>#${invoice_no}<b><p></td>
                            <td width='50%' align='right'><p>Date: <b>${invoice_date}</b></p></td>
                        </tr>
                        <tr>
                            <td width='48%' align='left'>
                                <h2 stype="font-size: 18px;">Mirrorinfo Tech PVT LTD</h2>
                                <p>9112174242<br/>
                                support@mirrorinfo.in<br/>
                                oﬃce no 314,bramha majestic,nibm <br/>
                                road,kondhwa pune maharashtra pune 411048
                            </td>
                            <td width='48%' align='right'>
                                <h2 stype="font-size: 18px;">Billing address</h2>
                                <p>${name}<br/>
                                ${mobile}</p><br/><br/>
                            </td>
                        </tr>
                    </table>
                </div>
                <br/>
                <br/>
                <div class="container"> 
                    <table class='table' width='100%' style='background-color:#F9FBFF;'>
                        <thead style='background-color:#0177CD; color:#fff'>
                            <tr>
                                <th>No.</th>
                                <th>Item Description</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>${item_name} / ${order_id}</td>
                                <td>${amount}</td>
                                <td>${unit}</td>
                                <td>${amount}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <div class="container"> 
                    <table width='100%'>
                        <tr>
                            <td width='60%'>
                            <p><b>Payment Details</b><br/>
                            ${gateway}<br/>
                            Bank ref. no.: ${bank_ref_no}<br/>
                            Tracking Id: ${tracking_id}<br/>
                            ${payment_date}
                            </p>
                            
                            </td>
                            <td width='40%'>
                                <table class='table table1' width='100%' style='border-collapse: collapse; ' >
                                    <tr>
                                        <td><b>Sub Total</b></td>
                                        <td>${amount}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Total</b></td>
                                        <td>${amount}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
                <br/>
                <br/>
                <br/>
                <br/>
                <div class="container"> 
                    <table width='100%' style='background-color:#F9FBFF;'>
                        <tr>
                            <td width='50%'>
                                <p>
                                    Phone: +919112421742<br/>
                                    Email: support@mirrorinfo.in<br/> 
                                    Website: https://mirrorhub.in<br/>
                                    All copy right reserved © 2024 mirrorinfo tech pvt ltd
                                </p>
                            </td>
                            <td width='50%' align='right'><img src="${baseurl}/uploads/signature.jpg" width="200" height="50"/></td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>`;
    
            const options = { format: 'A4' };
            return new Promise((resolve, reject) => {
                const pdfPath = `uploads/invoice/${invoice_no}_${mlm_id}.pdf`;
                pdf.create(htmlContent, options).toFile(pdfPath, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(pdfPath);
                });
            });
            
        }catch
        {

        }
  };
  
  module.exports = {
    messaging,
    generate_invoice
  };