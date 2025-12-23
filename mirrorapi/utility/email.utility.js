const nodemailer = require('nodemailer');
const db = require("../config/db.config").connect();

// Generic Email Message Fetcher
async function getEmailMessage(templateType, placeholders = {}, ignoreList = []) {
    try {
        const template = await db.marketing_content.findOne({
            where: { templateType, status: 1, type: "email" },
            order: [["created_on", "DESC"]],
        });

        if (!template) {
            console.warn(`No email template found for type: ${templateType}`);
            return null;
        }

        let subject = template.subject || "Notification";
        let body = template.body || "";

        const replacer = (_, key1, key2) => {
            const key = (key1 || key2).trim();
            if (ignoreList.includes(key)) return `{{${key}}}`;
            const replacement = placeholders[key];
            return replacement !== undefined ? replacement : `{{${key}}}`;
        };

        subject = subject.replace(/{{(.*?)}}|\$\{(.*?)\}/g, replacer);
        body = body.replace(/{{(.*?)}}|\$\{(.*?)\}/g, replacer);

        return { subject, body };
    } catch (err) {
        console.error("Error fetching Email message:", err.message);
        return null;
    }
}

/* ------------------- Specific Email Messages ------------------- */

async function registerEmailMessage(first_name, last_name, mobile) {
    return await getEmailMessage("register", { first_name, last_name, mobile });
}

async function loginEmailMessage(first_name, last_name, address, mobile) {
    return await getEmailMessage("login", { first_name, last_name, address, mobile });
}

async function referralUserEmailMessage(referal_fname, referal_lname, user_fname, user_lname, mobile, mlm_user_id) {
    return await getEmailMessage("referral", { referal_fname, referal_lname, user_fname, user_lname, mobile, mlm_user_id });
}

async function forgotPasswordEmailMessage(first_name, last_name, mobile) {
    return await getEmailMessage("password_reset", { first_name, last_name, mobile });
}

async function rechargeSuccessEmailMessage(first_name, last_name, mobile, cbamount, main_amount, consumer_mobile, transactionID) {
    return await getEmailMessage("recharge_success", { first_name, last_name, mobile, cbamount, main_amount, consumer_mobile, transactionID });
}

async function rechargeFailedEmailMessage(first_name, last_name, mobile, main_amount, consumer_mobile) {
    return await getEmailMessage("recharge_failed", { first_name, last_name, mobile, main_amount, consumer_mobile });
}

async function addMoneyRequestPendingEmailMessage(first_name, last_name, mobile, amount) {
    return await getEmailMessage("addmoney_request_pending", { first_name, last_name, mobile, amount });
}

async function addMoneyRequestApprovedEmailMessage(first_name, last_name, mobile, amount) {
    return await getEmailMessage("addmoney_request_approved", { first_name, last_name, mobile, amount });
}

async function addMoneyRequestRejectEmailMessage(first_name, last_name, mobile, amount, rejection_reason) {
    return await getEmailMessage("addmoney_request_reject", { first_name, last_name, mobile, amount, rejection_reason });
}

async function insuranceRequestEmailMessage(first_name, last_name, mobile) {
    return await getEmailMessage("insurance_request", { first_name, last_name, mobile });
}

async function sendMoneyEmailToUser(touserFirstName, touserLastName, to_mobile, fromuserFirstName, fromuserLastName, amount) {
    return await getEmailMessage("send_money_user", { touserFirstName, touserLastName, to_mobile, fromuserFirstName, fromuserLastName, amount });
}

async function sendMoneyEmailSender(touserFirstName, touserLastName, to_mobile, fromuserFirstName, fromuserLastName, amount) {
    return await getEmailMessage("send_money_sender", { touserFirstName, touserLastName, to_mobile, fromuserFirstName, fromuserLastName, amount });
}

async function kycApprovedEmailMessage(first_name, last_name, mobile) {
    return await getEmailMessage("kyc_approved", { first_name, last_name, mobile });
}

async function kycRequestEmailMessage(first_name, last_name, mobile) {
    return await getEmailMessage("kyc_request", { first_name, last_name, mobile });
}

async function kycRejectEmailMessage(first_name, last_name, mobile, rejection_reason) {
    return await getEmailMessage("kyc_reject", { first_name, last_name, mobile, rejection_reason });
}

async function addMoneyEmail(first_name, last_name, mobile, amount) {
    return await getEmailMessage("addmoney", { first_name, last_name, mobile, amount });
}

async function addMoneyFailEmail(first_name, last_name, mobile, amount) {
    return await getEmailMessage("addmoney_fail", { first_name, last_name, mobile, amount });
}

async function redeemRequestEmail(first_name, last_name, mobile, amount) {
    return await getEmailMessage("redeem_request", { first_name, last_name, mobile, amount });
}

async function redeemRejectEmail(first_name, last_name, mobile, amount, reason) {
    return await getEmailMessage("redeem_reject", { first_name, last_name, mobile, amount, reason });
}

async function redeemApproveEmail(first_name, last_name, mobile, amount) {
    return await getEmailMessage("redeem_approve", { first_name, last_name, mobile, amount });
}

async function feedbackEmail(first_name, last_name) {
    return await getEmailMessage("feedback", { first_name, last_name });
}

async function adminIncomeCreditEmail(first_name, last_name, amount, wallet_type) {
    return await getEmailMessage("admin_incomecredit", { first_name, last_name, amount, wallet_type });
}

async function idAutoBlockEmail(first_name, last_name) {
    return await getEmailMessage("id_autoblock", { first_name, last_name });
}

async function primePurchaseEmail(name, plan_name) {
    return await getEmailMessage("prime_purchase", { name, plan_name });
}


async function send_mail(to, subject, message) {
    console.log("Preparing to send email to:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);
    const transporter = nodemailer.createTransport({
        host: "185.185.126.30",
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

    try {
         const mailSubject = message?.subject || subject || "No Subject";
         const mailBody = message?.body || (typeof message === "string" ? message : JSON.stringify(message));

        const info = await transporter.sendMail({
            from: "update@mayway.in",
            to: String(to),
            subject: String(mailSubject),
            text: mailBody
        });

        console.log("Email sent:", info.response);
        return info.response;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


module.exports = {
    send_mail,
    getEmailMessage,
    registerEmailMessage,
    loginEmailMessage,
    referralUserEmailMessage,
    forgotPasswordEmailMessage,
    rechargeSuccessEmailMessage,
    rechargeFailedEmailMessage,
    addMoneyRequestPendingEmailMessage,
    addMoneyRequestApprovedEmailMessage,
    addMoneyRequestRejectEmailMessage,
    insuranceRequestEmailMessage,
    sendMoneyEmailToUser,
    sendMoneyEmailSender,
    kycApprovedEmailMessage,
    kycRequestEmailMessage,
    kycRejectEmailMessage,
    addMoneyEmail,
    addMoneyFailEmail,
    redeemRequestEmail,
    redeemRejectEmail,
    redeemApproveEmail,
    feedbackEmail,
    adminIncomeCreditEmail,
    idAutoBlockEmail,
    primePurchaseEmail,
    getEmailMessage
};
