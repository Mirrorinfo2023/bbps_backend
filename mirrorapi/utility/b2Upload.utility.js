
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();
const crypto = require("crypto");

let authData = null;

const B2 = require("backblaze-b2");
const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
});

// ---------------- Authorize ----------------
async function authorizeAccount() {
    const authString = Buffer.from(
        `${process.env.B2_KEY_ID}:${process.env.B2_APPLICATION_KEY}`
    ).toString("base64");

    const res = await axios.get(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
            headers: {
                Authorization: "Basic " + authString,
            },
        }
    );
    authData = res.data;
    return authData;
}

// ---------------- Get Upload URL ----------------
async function getUploadUrl() {
    if (!authData) authData = await authorizeAccount();
    if (!authData) throw new Error("Authorization failed");

    const res = await axios.post(
        `${authData.apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: authData.allowed.bucketId },
        { headers: { Authorization: authData.authorizationToken } }
    );
    return res.data;
}

// ---------------- Upload Category Image ----------------
async function uploadCategoryImage(file, categoryId) {
    if (!authData) authData = await authorizeAccount();
    const uploadInfo = await getUploadUrl();

    const filePath = file.path;
    const fileName = `coursecategories/${categoryId}/${file.originalname}`; // organized per category
    const fileBuffer = fs.readFileSync(filePath);

    const res = await axios.post(uploadInfo.uploadUrl, fileBuffer, {
        headers: {
            Authorization: uploadInfo.authorizationToken,
            "X-Bz-File-Name": encodeURIComponent(fileName),
            "Content-Type": file.mimetype,
            "X-Bz-Content-Sha1": "do_not_verify",
        },
    });

    return {
        fileName: res.data.fileName,
        fileId: res.data.fileId,
        downloadUrl: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${res.data.fileName}`,
    };
}


// ---------------- Upload Banner ----------------
async function uploadBanner(file) {
    if (!authData) authData = await authorizeAccount(); // ensure authData exists
    const uploadInfo = await getUploadUrl();

    const filePath = file.path;
    const fileName = `banners/${file.originalname}`; // prevent overwriting
    const fileBuffer = fs.readFileSync(filePath);

    const res = await axios.post(uploadInfo.uploadUrl, fileBuffer, {
        headers: {
            Authorization: uploadInfo.authorizationToken,
            "X-Bz-File-Name": encodeURIComponent(fileName),
            "Content-Type": file.mimetype,
            "X-Bz-Content-Sha1": "do_not_verify",
        },
    });

    return {
        fileName: res.data.fileName,
        fileId: res.data.fileId,
        downloadUrl: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${res.data.fileName}`,
    };
}

// ---------------- Upload KYC File ----------------
async function uploadKycFile(file, userId) {
    if (!authData) authData = await authorizeAccount(); // ensure authData exists
    const uploadInfo = await getUploadUrl();

    const filePath = file.path;
    // Save files under "kyc/{userId}/" folder in B2
    const fileName = `kyc/${userId}/${file.originalname}`;
    const fileBuffer = fs.readFileSync(filePath);

    const res = await axios.post(uploadInfo.uploadUrl, fileBuffer, {
        headers: {
            Authorization: uploadInfo.authorizationToken,
            "X-Bz-File-Name": encodeURIComponent(fileName),
            "Content-Type": file.mimetype,
            "X-Bz-Content-Sha1": "do_not_verify",
        },
    });

    return {
        fileName: res.data.fileName,
        fileId: res.data.fileId,
        downloadUrl: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${res.data.fileName}`,
    };
}



// ---------------- List Banners ----------------
async function listBanners() {
    if (!authData) authData = await authorizeAccount();

    const res = await axios.post(
        `${authData.apiUrl}/b2api/v2/b2_list_file_names`,
        {
            bucketId: authData.allowed.bucketId,
            prefix: `banners/`,
        },
        { headers: { Authorization: authData.authorizationToken } }
    );

    return res.data.files.map((file) => ({
        fileName: file.fileName,
        url: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${file.fileName}`,
    }));
}

// ---------------- Signed URL ----------------
function getSignedUrl(fileName, validDurationInSeconds = 7 * 24 * 3600) {
    const expirationTimestamp =
        Math.floor(Date.now() / 1000) + validDurationInSeconds;
    const authToken = process.env.B2_APPLICATION_KEY;

    const path = `/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
    const authString = `${authToken}${path}${expirationTimestamp}`;
    const sha1 = crypto.createHash("sha1").update(authString).digest("hex");

    return `${authData.downloadUrl}${path}?Authorization=${sha1}&Expires=${expirationTimestamp}`;
}

async function getPrivateFileUrl(fileName, validDurationInSeconds = 3600) {
    try {
        await b2.authorize(); // Must call before using other APIs

        const downloadAuth = await b2.getDownloadAuthorization({
            bucketId: process.env.B2_BUCKET_ID,
            fileNamePrefix: fileName.fileName,
            validDurationInSeconds
        });

        const signedUrl = `${b2.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${fileName.fileName}?Authorization=${downloadAuth.data.authorizationToken}`;
        return signedUrl;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
}

// ---------------- Delete Banner ----------------
async function deleteBanner(fileName) {
    if (!authData) authData = await authorizeAccount();

    const listRes = await axios.post(
        `${authData.apiUrl}/b2api/v2/b2_list_file_names`,
        {
            bucketId: authData.allowed.bucketId,
            prefix: fileName,
        },
        { headers: { Authorization: authData.authorizationToken } }
    );

    const file = listRes.data.files.find((f) => f.fileName === fileName);
    if (!file) throw new Error("File not found");

    const deleteRes = await axios.post(
        `${authData.apiUrl}/b2api/v2/b2_delete_file_version`,
        {
            fileName: file.fileName,
            fileId: file.fileId,
        },
        { headers: { Authorization: authData.authorizationToken } }
    );

    return deleteRes.data;
}

async function listProductImages() {
    if (!authData) authData = await authorizeAccount();
    const res = await axios.post(
        ` ${authData.apiUrl}/b2api/v2/b2_list_file_names`,
        {
            bucketId: authData.allowed.bucketId,
            prefix: `banner1/`
        },
        { headers: { Authorization: authData.authorizationToken } }
    );

    return res.data.files.map(file => ({
        fileName: file.fileName,
        url: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${file.fileName}`
    }));
}

// ---------------- List of All Banner Images ----------------
async function listOfBannerImg() {
    if (!authData) authData = await authorizeAccount();

    const res = await axios.post(
        `${authData.apiUrl}/b2api/v2/b2_list_file_names`,
        {
            bucketId: authData.allowed.bucketId,
            prefix: "banners/",   // ✅ fetch all images inside banners/ folder
        },
        { headers: { Authorization: authData.authorizationToken } }
    );

    // Return array of objects with filename + public URL
    return res.data.files.map((file) => ({
        fileName: file.fileName,
        url: `${authData.downloadUrl}/file/${process.env.B2_BUCKET_NAME}/${file.fileName}`,
    }));
}


module.exports = {
    uploadBanner,
    listBanners,
    getSignedUrl,
    deleteBanner,
    getPrivateFileUrl,
    listProductImages,
    listOfBannerImg,   // ✅ new function,
    uploadKycFile,   // ✅ new function
    uploadCategoryImage
};
