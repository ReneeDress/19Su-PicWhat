// pages/identity/identity.js
// pages/beauty/beauty.js
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
    ifupload: false,
    url: '',
    r: 5,
    g: 0,
    b: 255,
    doneUrl: '',
    doneImage: '',
    none: 'flex',
    loading: '正在加载...',
    blur: 7,
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
    var ctx = wx.createCanvasContext('firstcanvas')
    ctx.setFillStyle('#DCDCDC')
    ctx.fillRect(0,0,myCanvasWidth,myCanvasHeight)
    ctx.draw()
  },

  //点击 选择图片 按钮
  choose_image:function(e){
    var that=this
    var tempFilePath
    var downloadImagePath
    var downloadImage
    var imagewidth
    var imageheight
    var imageType
    let json
    //创建canvas的绘图上下文对象
    var ctx = wx.createCanvasContext('firstcanvas')
    this.setData({
      ifupload: false,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    //读取一张图片
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'],
      // sourceType: ['album', 'camera'],
      success:function(res){
        tempFilePath = res.tempFilePaths    //获取临时url
        that.setData({
          url: tempFilePath[0],
          ifupload: true,
        })
        console.log(tempFilePath[0])
        wx.getImageInfo({
          src: that.data.url,
          success: function(res){
            imageType = res.type
            console.log(res)
            console.log(imageType)
            wx.uploadFile({
              filePath: tempFilePath[0],
              name: 'file',
              url: 'http://127.0.0.1:5000/upload',
              success: function(res){
                console.log(JSON.parse(res.data))
                json = JSON.parse(res.data)
                // 返回base64编码的图片
                if (imageType=='jpeg'){
                  downloadImage = "data:image/JPEG;base64," + json['b64']
                }else if (imageType=='png'){
                  downloadImage = "data:image/PNG;base64," + json['b64']
                }
                that.setData({
                  // doneImage: downloadImage,
                  doneUrl: json['path'],
                  // none: 'none',
                  // loading: '',
                })
                that.identity()
                // // console.log(downloadImage)
                // // base64编码转url
                // base64src(downloadImage, res=>{
                //   downloadImagePath = res
                //   console.log(downloadImagePath)
                //   that.setData({
                //     doneUrl: downloadImagePath
                //   })
                //   console.log(that.data.doneUrl)
                // })
              }
            })
          }
        })
      }
    })
  },
  identity: function() {
    let that = this
    var downloadImagePath
    var downloadImage
    var imageType
    wx.getImageInfo({
          src: that.data.url,
          success: function(res){
            imageType = res.type
            console.log(imageType)
            wx.request({
              url: 'http://127.0.0.1:5000/identity',
              data: {   //将数据格式转为JSON
                imgTempUrl: JSON.stringify(that.data.doneUrl),
                RGB: JSON.stringify({'r': that.data.r, 'g': that.data.g, 'b': that.data.b}),
                Blur: JSON.stringify(that.data.blur),
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
              },
              success: function(res){
                console.log(res.data)
                if (res.data == 'white') {
                  that.setData({
                    loading: '白底不可用',

                  })
                }
                else if (res.data == 'red') {
                  that.setData({
                    loading: '红底效果不佳 正在调试',
                  })
                }
                else {
                    // 返回base64编码的图片
                  if (imageType=='jpeg'){
                    downloadImage = "data:image/JPEG;base64," + res.data
                  }else if (imageType=='png'){
                    downloadImage = "data:image/PNG;base64," + res.data
                  }
                  that.setData({
                    doneImage: downloadImage,
                    none: 'none',
                    loading: '',
                  })
                  
                }
              }
            })
          }
    })
  },
  sliderChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      blur: e.detail.value,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    this.identity()
  },
  sliderChangeR: function(e) {
    console.log(e.detail.value)
    this.setData({
      r: e.detail.value,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    this.identity()
  },
  sliderChangeG: function(e) {
    console.log(e.detail.value)
    this.setData({
      g: e.detail.value,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    this.identity()
  },
  sliderChangeB: function(e) {
    console.log(e.detail.value)
    this.setData({
      b: e.detail.value,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    this.identity()
  },
  done: function(e) {
    wx.navigateTo({
      url: '../done/done?b64=' + this.data.doneImage,
    })
  },
  index: function(e) {
    app.globalData.url = null
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      ifupload: false
    })
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