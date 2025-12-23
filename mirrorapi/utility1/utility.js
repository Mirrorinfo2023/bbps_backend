	const crypto = require('crypto');
	 const substitutionMap = {
        A: 'Z', B: 'Y', C: 'X', D: 'W', E: 'V',
        F: 'U', G: 'T', H: 'S', I: 'R', J: 'Q',
        K: 'P', L: 'O', M: 'N', N: 'M', O: 'L',
        P: 'K', Q: 'J', R: 'I', S: 'H', T: 'G',
        U: 'F', V: 'E', W: 'D', X: 'C', Y: 'B',
        Z: 'A',
        a: 'z', b: 'y', c: 'x', d: 'w', e: 'v',
        f: 'u', g: 't', h: 's', i: 'r', j: 'q',
        k: 'p', l: 'o', m: 'n', n: 'm', o: 'l',
        p: 'k', q: 'j', r: 'i', s: 'h', t: 'g',
        u: 'f', v: 'e', w: 'd', x: 'c', y: 'b',
        z: 'a',
        1: '9', 2: '8', 3: '7', 4: '6', 5: '5',
        6: '4', 7: '3', 8: '2', 9: '1', 0: '0'
      };

	function padTo2Digits(num) {
		return num.toString().padStart(2, '0');
	}
	
	function formatDate(date) {
		return [
		  date.getFullYear(),
		  padTo2Digits(date.getMonth() + 1),
		  padTo2Digits(date.getDate()),
		].join('-');
	  }
	
	function formatDateTime(date) {
		return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
	
	function formatDateTimeDMY(date) {
		return date.getDate().toString().padStart(2, '0')+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	}
	
	function AesKey(){
			return Buffer.from('a2cde7fbb7a767c2e23068ac125eb5282dc48bf11ea47abe89e3fd2a2c383cd0', 'hex');
	}

	function setKeySecret(secret) {
		  const sha256 = crypto.createHash('sha256');
		  const hashedKey = sha256.update(secret, 'utf8').digest();
		  const truncatedKey = hashedKey.slice(0, 16); // Truncate to 128 bits (16 bytes)

		  return truncatedKey;
	}
	function generateRandomString(length) {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
        
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
          }
        
          return result;
        }
        
    function generateUniqueNumeric(length) {
          const generatedStrings = new Set();
          const characters = '0123456789';
          const timestamp = Date.now().toString();
          const uniqueTransactionId = timestamp.slice(-9);
          
          while (true) {
            let result = '';
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
        
            if (!generatedStrings.has(result)) {
              generatedStrings.add(result);
            //   return result;
             return `${uniqueTransactionId}`;
            }
          }
          
    }
    
    function generateMrId(length) {
          const generatedStrings = new Set();
          const characters = '0123456789';
          const timestamp = Date.now().toString();
          const uniqueTransactionId = timestamp.slice(-5);
          
          while (true) {
            let result = '';
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              result += characters.charAt(randomIndex);
            }
        
            if (!generatedStrings.has(result)) {
              generatedStrings.add(result);
            //   return result;
             return `${uniqueTransactionId}`;
            }
          }
          
    }
    
    function generateUniqueNumericAddMoney(length) {
      const generatedStrings = new Set();
      const characters = '0123456789';
     
      while (true) {
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
    
        if (!generatedStrings.has(result)) {
          generatedStrings.add(result);
          return result;
          
        }
      }
      
    }
    
    
    
    
    
    
    function md5(input) {
      return crypto.createHash('md5').update(input).digest('hex');
  }
    
  function bbpsEncrypt(plainText, key) {
      const keyBuffer = Buffer.from(md5(key), 'hex');
      const initVector = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
      const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, initVector);
      let encryptedText = cipher.update(plainText, 'utf-8', 'hex');
      encryptedText += cipher.final('hex');
    
      return encryptedText;
  }
  
  function bbpsDecrypt(encryptedText, key) {
    const keyBuffer = Buffer.from(Buffer.from(md5(key), 'hex'));
    const initVector = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]);
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, initVector);
    let decryptedText = decipher.update(encryptedBuffer, 'binary', 'utf-8');
    decryptedText += decipher.final('utf-8');
  
    return decryptedText;
  }
  
 function generateRequestId() {
    const randomString = generateRandomString(27);
    const now = new Date();
    const year = now.getUTCFullYear().toString().substr(-1);
    const dayOfYear = getDayOfYear(now).toString().padStart(3, '0');
    const hours = now.getUTCHours().toString().padStart(2, '0');
    const minutes = now.getUTCMinutes().toString().padStart(2, '0');

    return `${randomString}${year}${dayOfYear}${hours}${minutes}`;
  }
  
//   function getJulianDate() {
//     const date = new Date();
//     const year = date.getFullYear().toString().substr(-1);
//     const dayOfYear = date.getDate(date).toString().padStart(2, '0');
//     const hours = date.getHours().toString().padStart(2, '0');
//     const minutes = date.getMinutes().toString().padStart(2, '0');
  
//     return `${year}0${dayOfYear}${hours}${minutes}`;
//   }
  
  function getDayOfYear(date) {
    const start = new Date(date.getUTCFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const dayOfYear = Math.floor(diff / oneDay) + 1; // Adding 1 to make it 1-based
    return dayOfYear;
  }
  
  function DataEncrypt(string)
  {
    const receprocalData = string.split('').map(char => substitutionMap[char] || char).join('');
    const encryptData = Buffer.from(receprocalData).toString('base64');
    return encryptData;
  }

  function DataDecrypt(data) {
    const buffer = Buffer.from(data, 'base64').toString('utf-8');
    const reverseSubstitutionMap = {};
    Object.entries(substitutionMap).forEach(([key, value]) => {
      reverseSubstitutionMap[value] = key;
    });
    
    const decryptedKey = buffer.split('').map(char => reverseSubstitutionMap[char] || char).join('');
    //const decryptedMessage = Buffer.from(decryptedKey, 'base64').toString('utf-8');
    const decryptString = decryptedKey.replace(/'/g, '"');
    const decryptedObject = JSON.parse(decryptString);

    return decryptedObject;
  }
  
  function generateAESToken(data, secretKey) {
      const iv = crypto.randomBytes(16); 
    
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    
      let encryptedData = cipher.update(data, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');
    
      return {
          iv: iv.toString('hex'),
          encryptedData: encryptedData
      };
    }
    
    
    function decryptAESToken(encryptedData, iv, secretKey) {
      // Create a decipher object
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
      
      // Decrypt the data
      let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
      decryptedData += decipher.final('utf-8');
    
      return decryptedData;
    }
    
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const timeZoneOffset = -currentDate.getTimezoneOffset() / 60;
        const offsetSign = timeZoneOffset >= 0 ? '+' : '-';
        const offsetHours = String(Math.abs(Math.floor(timeZoneOffset))).padStart(2, '0');
        const offsetMinutes = String(Math.abs(currentDate.getTimezoneOffset() % 60)).padStart(2, '0');
        const timeZone = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    
        return `${year}-${month}-${day}T${hours}:${minutes}:00${timeZone}`;
    }
    
    function verifySignature(encodedToken, secretKey) {
      const [encodedHeader, encodedPayload, signature] = encodedToken.split('.');
    
      const concatenatedData = `${encodedHeader}.${encodedPayload}`;
    
      const calculatedSignature = crypto.createHmac('sha256', secretKey)
          .update(concatenatedData)
          .digest('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
    
      return calculatedSignature === signature;
    }
    
    function decryptPayload(encodedPayload) {
      const decodedPayload = Buffer.from(encodedPayload, 'base64').toString();
      return JSON.parse(decodedPayload);
    }
    
    function ccgenerateRequestId() {
        const randomString = generateRandomString(15);
        const now = new Date();
        const year = now.getUTCFullYear().toString().substr(-1);
        const dayOfYear = getDayOfYear(now).toString().padStart(3, '0');
        const hours = now.getUTCHours().toString().padStart(2, '0');
        const minutes = now.getUTCMinutes().toString().padStart(2, '0');
    
        return `Order_${randomString}${year}${dayOfYear}${hours}${minutes}`;
      }
      
      
    function formatDateNew(dateStr) {
      const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
        Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
      };
      
      const [weekday, day, monthAbbr, year] = dateStr.split(' ');
      const month = months[monthAbbr];
      
      return `${year}-${month}-${day}`;
    }
    
    function getStartOfWeek(date) {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0); 
      return startOfWeek;
    };
    
    
    function getEndOfWeek(date){
      const endOfWeek = new Date(date);
      const day = endOfWeek.getDay();
      const diff = endOfWeek.getDate() + (7 - day); 
      endOfWeek.setDate(diff);
      endOfWeek.setHours(23, 59, 59, 999); 
      return endOfWeek;
    };


module.exports = {
  formatDate,
  formatDateTime,
  AesKey,
  setKeySecret,
  generateRandomString,
  generateUniqueNumeric,
  generateUniqueNumericAddMoney,
  bbpsEncrypt,
  bbpsDecrypt,
  generateRequestId,
  formatDateTimeDMY,
  DataEncrypt,
  DataDecrypt,
  generateAESToken,
  decryptAESToken,
  getCurrentDate,
  verifySignature,
  decryptPayload,
  ccgenerateRequestId,
  formatDateNew,
  generateMrId,
  getStartOfWeek,
  getEndOfWeek
};