const { connect } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { secretKey } = require('../../middleware/config'); 
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utility = require('../../utility/utility'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const qr = require('qrcode');
const fs = require('fs').promises;

class QrCode {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
	async getQrCode(req,res){
        const decryptedObject = utility.DataDecrypt(req.encReq);
        const { user_id,mobile } = decryptedObject;
    	  
        const requiredKeys = Object.keys({ user_id,mobile});
        
        if (!requiredKeys.every(key => key in decryptedObject && decryptedObject[key] !== '' && decryptedObject[key] !== undefined ) ) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys })));
            // return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
        }

        try {
           
            const qrCode = await this.db.qrcode.getData(['id','qrcode','mobile'], {user_id: user_id ,status:1});
            
                    if( qrCode!=null)
                    {
                        return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,message: 'Qrcode found successful',data: qrCode })));
                        // return res.status(200).json({ status: 200,message: 'Qrcode found successful',data: qrCode });
                    }
                    if( qrCode==null){
                        
                        // Generate QR code
                        const qrCodeImage = await this.generateQRCode(mobile);

                        // Save QR code image
                            const imagePath = `uploads/qrcodes/qrcode_${mobile}.jpg`;
                            await this.saveQRCodeImage(qrCodeImage, imagePath);

                            const insertQrData = {       
                                            user_id,
                                            mobile,
                                            qrcode:imagePath,
                                            created_by: user_id,
                                            
                                        };
        
                            const qrData = await this.db.qrcode.insertData(insertQrData);
                            return res.status(200).json(utility.DataEncrypt(JSON.stringify({ status: 200,token:'',message: 'Qr generate successful',data:qrData })));
                            // return res.status(200).json({ status: 200,token:'',message: 'Qr generate successful',data:qrData });
                    }
                 
           

        }catch (err) {
                logger.error(`Unable to find qrcode: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
                  return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 500,errors: validationErrors })));
    			 // return res.status(500).json({ status: 500,errors: validationErrors });
    			}
                return res.status(500).json(utility.DataEncrypt(JSON.stringify({ status: 500,token:'', message: err,data: []  })));
    			 //return res.status(500).json({ status: 500,token:'', message: err,data: []  });
        }
  

    }

        
    
          
          async  generateQRCode(data,size = 500) {
            try {
              // Generate QR code
              const qrCode = await qr.toDataURL(data);
              return qrCode;
            } catch (error) {
              throw error;
            }
          }
          
          async  saveQRCodeImage(qrCode, imagePath) {
            try {
              // Convert data URI to buffer
              const imageData = Buffer.from(qrCode.split(',')[1], 'base64');
          
              // Save buffer to file
              await fs.writeFile(imagePath, imageData);
          
              console.log(`QR code image saved to ${imagePath}`);
            } catch (error) {
              throw error;
            }
          }
  
  

}




module.exports = new QrCode();