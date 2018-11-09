const https = require("./https.js");
const { Cookie } = getApp().globalData;

/**
 * 请求配置示例
 * 服务器返回的数据格式是:
 * 1.添加，删除，查询，修改
 * {
 *     result: 0,
 *     data: {Object}
 * }
 * 2. 请求列表
 * {
 *     result: 0,
 *     data: {
 *         list: {Array}
 *     }
 * }
 * 3. 错误信息
 * {
 *     result: 错误码{Number|String},
 *     errMsg: 错误信息{String},
 * }
 * 不同规则请自行调整
 */

// 请求次数计数
let reqNumber = 0;

// 配置基本地址
https.defaults.baseUrl = 'https://www.easy-mock.com/mock/5be4fb5e606f6b5b7dce2175/example';

// 请求前的处理
https.interceptors.request.use((reqUrl) => {
    // 从缓存中获取 cookie (携带者唯一id), 该id应该是在登录后存储在redis中后返回的id(key)
    https.defaults.headers.Cookie = wx.getStorageSync("wxSession") || "";
    reqNumber = reqNumber + 1;
    // 任何请求开始显示此提示
    wx.showLoading({
        title: '加载中',
    });
});

/**
 * @desc 请求后返回的处理, 根据不同业务规则可以更改，这里是常用的配置
 * 
 **/
https.interceptors.response.use((res, reqUrl) => {
    let errorText = '';
    switch (res.statusCode) {
        // 接受到服务器返回的 http 401 状态则表示没有登录
        case 401:
            const wxSession = wx.getStorageSync("wxSession");
            reqNumber = 0;
            // 如果 wxSession 已经存储接收到 401 代表 redis 中信息已经过期
            if (wxSession) {
                errorText = '登陆信息过期，请重新登录';
                wx.reLaunch({
                    url: '/src/views/login/login',
                    success: function () {
                        wx.showModal({
                            content: errorText,
                            showCancel: false,
                        });
                    }
                });
            }
            wx.reLaunch({
                url: '/src/views/login/login',
            });
            wx.hideLoading();
            throw new Error("没有权限访问");
            break;
        // 接收到 403 状态码, 表示已经登录但是用户的权限(等级)不够
        case 403:
            reqNumber = 0;
            errorText = '权限不足, 拒绝访问';
            wx.hideLoading();
            wx.navigateBack({
                delta: 1,
                complete: () => {
                    wx.showModal({
                        content: errorText,
                        showCancel: false,
                    });
                }
            });
            throw new Error(errorText);
            break;
        default:
            reqNumber = reqNumber - 1;
            if (reqNumber <= 0) {
                reqNumber = 0;
                wx.hideLoading();
            }

            handlerList(reqUrl, res.data);
            break;
    }
    // 判断是否成功，不同规则可自行调整
    if (res.data.result == 0 || !res.data.result) {
        return res;
    } else {
        wx.showModal({
            content: res.data.errMsg.message,
            showCancel: false,
        });
        throw new Error(res.data.errMsg.message);
    }
}, (err) => {
    console.log(err, '...');
});

/**
 * @desc 统一处理列表加载, 每个列表请求的url规则结尾应该是"/list"， 
 * 不同规则请自行修改
 * 
 * */
function handlerList (reqUrl, data) {
    let urls = reqUrl.split("/");
    let endStr = urls[urls.length - 1];
    // 判断url是否是请求列表以及根据列表返回的数据总长度判断是否全部加载
    if (endStr.indexOf("list") >= 0 && data.data.list.length <= 0) {
        wx.showToast({
            icon: 'success',
            title: '已加载全部数据',
        });
    }
}

module.exports = https;