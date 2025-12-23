const fs = require('fs');
const axios = require('axios');
const B2 = require('backblaze-b2');
require('dotenv').config();

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY
});

let authData = null;

async function authorizeB2() {
    if (!authData) authData = await b2.authorize();
    return authData;
}

async function getUploadUrl() {
    const auth = await authorizeB2();
    const res = await axios.post(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: auth.allowed.bucketId },
        { headers: { Authorization: auth.authorizationToken } }
    );
    return res.data;
}

async function uploadKycImage(userId, file) {
    const uploadInfo = await getUploadUrl();
    const fileBuffer = fs.readFileSync(file.path);
    const fileName = `upload/kyc/${userId}/${Date.now()}_${file.originalname}`;

    const res = await axios.post(uploadInfo.uploadUrl, fileBuffer, {
        headers: {
            Authorization: uploadInfo.authorizationToken,
            'X-Bz-File-Name': encodeURIComponent(fileName),
            'Content-Type': file.mimetype,
            'X-Bz-Content-Sha1': 'do_not_verify'
        }
    });

    return {
        fileName: res.data.fileName,
        fileId: res.data.fileId,
        downloadUrl: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${res.data.fileName}`
    };
}

module.exports = { uploadKycImage };
