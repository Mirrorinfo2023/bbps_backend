// controllers/TestController.js
const nodemailer = require("nodemailer");
const axios = require("axios");
const messagingService = require('../../router/whatsapp/messagingService');

class TestController {
    // Test Email
    static async sendEmail(req, res) {
        try {
            const transporter = nodemailer.createTransport({
                host: "185.185.126.30", // or "127.0.0.1" if running inside CWP server
                port: 465,
                secure: true,
                auth: {
                    user: "update@mayway.in",
                    pass: "NXDxuDz8",
                },
                tls: { rejectUnauthorized: false },
                logger: true,
                debug: true
            });

            const info = await transporter.sendMail({
                from: "update@mayway.in",
                to: "vinayakbansode5@gmail.com", // put your test email
                subject: "Test Email",
                text: "This is a test email from TestController",
            });

            console.log("Email sent:", info.response);
            return res.json({ success: true, message: "Email sent", info });
        } catch (error) {
            console.error("Email error:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    //Test WhatsApp (using UltraMsg API or Twilio)
    static async sendWhatsapp(req, res) {
        try {

            await messagingService.sendMessage('+917218196316', 'This is a test message from TestController', null);
            console.log("WhatsApp sent:", response.data);
            return res.json({ success: true, message: "WhatsApp sent", data: response.data });
        } catch (error) {
            console.error("WhatsApp error:", error.response?.data || error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = TestController;
