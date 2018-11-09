// src/views/home/home.js
const { regeneratorRuntime } = getApp().globalData;
const { formatDateComplete, getListHeight } = require("../../../utils/util.js");
const testApi = require("../../api/test.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        strs: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    async testGet() {
        const { data } = await testApi.testGet();
        this.data.strs.push(`${data.data.name}---${formatDateComplete(data.data.ctime)}`);
        this.setData({
            strs: this.data.strs
        });
    }
})