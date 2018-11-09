
const { regeneratorRuntime } = getApp().globalData;
const { $moment } = getApp().globalModule;

module.exports.getListHeight = () => {
    const res = wx.getSystemInfoSync();
    return res.windowHeight - 150;
}

module.exports.getFormatDate = (date) => {
    if (!date) {
        return "";
    }
    let result = $moment(date).format("YYYY-MM-DD");
    return result;
}

module.exports.formatDateComplete = (date) => {
    if (!date) {
        return "";
    }
    let result = $moment(date).format("YYYY-MM-DD HH:mm:ss");
    return result;
}

module.exports.getUnixDate = (date) => {
    if (!date) {
        return "";
    }
    let result = $moment(date).unix();
    console.log(result, date);
    return result;
}