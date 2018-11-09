const https = require("./https.config.js");
// 支持 async/await 
const { regeneratorRuntime } = getApp().globalData;
const base = '/test';

module.exports.testGet = async (data) => {
    return https.request({
        url: `${base}/get`,
        type: 'GET',
        data
    });
}