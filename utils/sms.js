const config = require('../config/config');
async function sendOtp(recipient){
    try {
        // generate random 6-digit OTP
        let randNumber = Math.floor(100000 + Math.random() * 900000);
        
        // API implementation of send OTP
        let url = config.msg91.baseUrl+"/otp?"+
        "template_id="+config.msg91.templets.otp+
        "&mobile="+recipient+
        "&authkey="+config.msg91.authKey+
        "&realTimeResponse=1&otp="+randNumber;

        let res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return {
            randNumber,
            ...res.data
        };
    } catch (err) {
        console.log(err);
        return {
            error: err.message
        };
    }
}

module.exports = { sendOtp };