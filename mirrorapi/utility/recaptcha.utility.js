const axios = require('axios');
const crypto = require('crypto');
const RECAPTCHA_SECRET_KEY = '6LeRyWIqAAAAALAKbG9MRt8qjkhtWd4LYalvO-jz';


async function captchaVerification(captchaToken) {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;

    try {
        const response = await axios.post(url);
        return response.data;
    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error);
        return { success: false, 'error-codes': ['verification-failed'] };
    }
}

module.exports = {
    captchaVerification
};