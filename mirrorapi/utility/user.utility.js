const axios = require('axios');
const crypto = require('crypto');

function userRegister(token, iv) {

    return new Promise((resolve, reject) => {
        const apiUrl = 'https://mirrorhub.in/api/check-user-register';

        axios.post(apiUrl, { encryptedToken: token, iv: iv },
            {
                headers: {
                  'apitoken': 'ZX2IN3P6MW8ASCVHT4YPBMJIKER9DF5OL1GL8MTRUB0GH7',
                },
              }
            )
            .then((response) => {
                resolve({ result: response.data}); 
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}



module.exports = {
    userRegister
};