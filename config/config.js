require('dotenv').config();

const config = {
    database: {
        dbConnectionString:process.env.MONGODB_CONNECTION_STRING
    },
    http: {
        port: 80
    },
    jwt: {
        secretKey: process.env.JWT_SECRET,
        expiry: "10d"
    },
    msg91:{
        authKey:process.env.MSG91_AUTH_KEY,
        baseUrl:"https://control.msg91.com/api/v5",
        templets:{
            otp:"6684e2cad6fc0540dc648dc2",//var 1 user var 2 otp
            welcome:""
        },
        senderId:"test123",
        route:4
    },
    cloudinary:{
        cloudName:process.env.CLOUDINARY_CLOUD_NAME,
        apiKey:process.env.CLOUDINARY_API_KEY,
        apiSecret:process.env.CLOUDINARY_API_SECRET
    },
    pagination:{
        limit:10,
        maxLimit:100
    }
};

module.exports = config;