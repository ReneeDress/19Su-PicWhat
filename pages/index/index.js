// pages/index.js
//导入base64转本地url函数
import { base64src } from '../../utils/base64src.js'
const app = getApp()
//画布长宽
var myCanvasWidth
var myCanvasHeight
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 414,
    windowHeight: 736,
    grid: 100,
    circle: 420,
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.hasOwnProperty("url"))
    if (options.hasOwnProperty("url")) {
      this.setData({
        url: options['url']
      })
    }
    else {
      this.setData({
        url: ''
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady:function(){
    // 获取手机屏幕长宽
    wx.getSystemInfo({
      success: (result) => {
        myCanvasWidth = result.windowWidth
        myCanvasHeight = result.windowHeight-150
      },
    })
    //设置画布长宽
    this.setData({
      canvasWidth : myCanvasWidth,
      canvasHeight : myCanvasHeight,
      windowWidth: myCanvasWidth,
      windowHeight: myCanvasHeight + 150,
      circle: myCanvasWidth,
      grid: (myCanvasWidth - 130)/2,
    })
  },

  crop: function() {
    wx.navigateTo({
      url: '../crop/crop?url=' + this.data.url,
      // url: '../cropper/cropper?url=' + this.data.url,
    })
  },

  scan: function() {
    wx.navigateTo({
      url: '../scan/scan?url=' + this.data.url,
    })
  },

  beauty: function() {
    wx.navigateTo({
      url: '../beauty/beauty?url=' + this.data.url,
    })
  },

  filter: function() {
    wx.navigateTo({
      url: '../filter/filter?url=' + this.data.url,
      // url: '../filter_x/filter_x?url=' + this.data.url,
    })
  },

  stitch: function() {
    wx.navigateTo({
      url: '../stitch/stitch?url=' + this.data.url,
    })
  },

  identity: function() {
    wx.navigateTo({
      url: '../identity/identity?url=' + this.data.url,
    })
  },

  about: function() {
    wx.navigateTo({
      url: '../about/about',
    })
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

  }
})