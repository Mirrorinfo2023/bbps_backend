const { connect } = require('../../config/db.config');
const whatsappUtility = require('../../utility/whatsapp.utility');
const emailUtility = require('../../utility/email.utility');
const axios = require('axios');
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);

class MessagingService {
    db = {};

    constructor() {
        this.db = connect();
    }

    waitTime = [10, 30, 25, 45, 55, 8, 60, 15, 5, 22];

    async sendMessage(mobile, message, media_url = null, email = null, subject = null, emailmsg = null) {
        try {
            // Get current date and time
            const now = new Date();
            const formattedDateTime = now.toLocaleString('en-IN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            // Append date-time to the message
            const messageWithTimestamp = `${message}\n\nSent on: ${formattedDateTime}`;

            // Random delay
            const delaySeconds = this.waitTime[Math.floor(Math.random() * this.waitTime.length)];
            const delayMs = delaySeconds * 1000;

            console.log(`Delaying ${delaySeconds}s before sending to ${mobile}`);
            await new Promise(resolve => setTimeout(resolve, delayMs));

            const whatsapp_setting = await this.getWhatsappSetting();
            const responseData = await whatsappUtility.ApiWhatsappMsg(
                mobile,
                messageWithTimestamp, // send message with timestamp
                media_url,
                whatsapp_setting.instance_id,
                whatsapp_setting.access_token
            );

            if (email && subject) {
                try {
                    
                    await emailUtility.send_mail(email, subject, emailmsg);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
        } catch (error) {
            logger.error(`Error in messaging service: ${error}`);
        }
    }


    async insertDataIfNotExists(notificationLog) {
        const { user_id, service, transaction_id, entry_datetime } = notificationLog;

        const exists = await this.db.whatsapp_notification.findOne({
            where: {
                user_id,
                service,
                transaction_id: transaction_id || null,
                entry_datetime: this.db.sequelize.where(
                    this.db.sequelize.fn('DATE', this.db.sequelize.col('entry_datetime')),
                    '=',
                    this.db.sequelize.fn('DATE', entry_datetime)
                )
            }
        });

        if (!exists) {
            await this.db.whatsapp_notification.insertData(notificationLog);
            return true;
        }
        return false;
    }

    async getWhatsappSetting() {
        return await this.db.whatsapp_setting.findOne({
            where: { status: 1 },
            order: [['id', 'DESC']]
        });
    }

    /**  Broadcast Call Function (Dynamic Numbers & File) */
    async broadcastCall() {
        //numbers, recordedFile
        try {
            // Convert numbers array to comma-separated string
            // const numbersString = Array.isArray(numbers) ? numbers.join(',') : numbers;

            const url = `http://login5.spearuc.com/MOBILE_APPS_API/voicebroadcast_api.php`;

            const params = {
                type: 'broadcast',
                user: 'MIRRORHUB2',
                pass: 'Mirror$$2020',
                reconnects_interval: "30",
                recorded_file: "23583_4_20250823125757",
                to_numbers: "+917218196316"
            };

            const response = await axios.get(url, { params });
            console.log('Broadcast API Response:', response.data);
            return response.data;

        } catch (error) {
            console.error('Error calling Broadcast API:', error.message);
            throw error;
        }
    }
}

module.exports = new MessagingService();
