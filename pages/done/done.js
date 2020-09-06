// pages/done/done.js
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
    btn: 50,
    circle: 420,
    url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594890405908&di=c16302dfb9f800ef671b642c863a510d&imgtype=0&src=http%3A%2F%2Ffiles.eduuu.com%2Fimg%2F2018%2F08%2F31%2F165834_5b89033a29d57.jpg',
    doneImage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options['b64'])
    this.setData({
      doneImage: options['b64'],
      url: options['b64'],
    })
    console.log(this.data.doneImage)
    if (this.data.doneImage.indexOf("data:image") != -1) {
      base64src(this.data.doneImage, res => {
        console.log(res) // 返回图片地址，直接赋值到image标签即可
        that.setData({
          url: res
        })
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
      btn: myCanvasWidth*0.121,
    })
  },

  home: function() {
    app.globalData.url = null;
    wx.reLaunch({
      url: '../index/index',
    })
  },

  share: function() {
    app.globalData.url = null;
    let that = this
    wx.showToast({
      title: '长按分享给好友',
      duration: 2000,
      icon: 'none'
    })
    wx.previewImage({
      urls: [that.data.url],
    })
  },

  ctnu: function() {
    app.globalData.url = this.data.url;
    wx.reLaunch({
      url: '../index/index?url=' + this.data.url,
    })
  },

  onShareAppMessage: function(options) {
    // console.log("options=",options);
    // var that = this;
    // // 设置菜单中的转发按钮触发转发事件时的转发内容
    // var shareObj = {
    //   title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
    //   path: '/pages/share/share', // 默认是当前页面，必须是以‘/'开头的完整路径
    //   imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
    //   success: function(res) {
    //     // 转发成功之后的回调
    //     if (res.errMsg == 'shareAppMessage:ok') {}
    //   },
    //   fail: function() {
    //     // 转发失败之后的回调
    //     if (res.errMsg == 'shareAppMessage:fail cancel') {
    //       // 用户取消转发
    //     } else if (res.errMsg == 'shareAppMessage:fail') {
    //       // 转发失败，其中 detail message 为详细失败信息
    //     }
    //   },
    //   complete:function(){
    //       // 转发结束之后的回调（转发成不成功都会执行）
    //   },
    // };
    // // 来自页面内的按钮的转发
    // if (options.from == 'button') {
    //   var eData = options.target.dataset;
    //   console.log("options.target.dataset=",eData.name); // shareBtn
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = that.url;
    //   // shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    // }
    // // 返回shareObj
    // return shareObj;
  },

  save: function() {
    let that = this;
    app.globalData.url = null;
    console.log('Saving.')
    console.log(that.data.url)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.url,
      success:function (data) {
      console.log(data);
      wx.showToast({
        title: '保存成功',
        duration: 3000,
        icon: 'none'
      })
    },
    // wx.downloadFile({
    //   url: that.data.url,
    //   success:function (res) {
    //     console.log(res);
    //     //图片保存到本地
    //     wx.saveImageToPhotosAlbum({
    //       filePath: res.tempFilePath,
    //       success:function (data) {
    //       console.log(data);
    //       wx.showToast({
    //         title: '保存成功',
    //         duration: 3000,
    //         icon: 'none'
    //       })
    //     },
    //       fail:function (err) {
    //         console.log(err);
    //         if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
    //         console.log("用户一开始拒绝了，我们想再次发起授权")
    //         console.log('打开设置窗口')
    //           wx.openSetting({
    //             success(settingdata) {
    //               console.log(settingdata)
    //               if (settingdata.authSetting['scope.writePhotosAlbum']) {
    //                 console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
    //               }else {
    //                 console.log('获取权限失败，给出不给权限就无法正常使用的提示')
    //               }
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }
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