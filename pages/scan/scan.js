// pages/scan/scan.js
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
    doneUrl: '',
    doneImage: '',
    none: 'flex',
    loading: '正在加载...',
    ifone: '#f7971e',
    iftwo: 'transparent',
    ifthr: 'transparent',
    ImageArray: {},
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
    this.setData({
      ifupload: false,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
      cur: 0
    })
    //创建canvas的绘图上下文对象
    var ctx = wx.createCanvasContext('firstcanvas')
    //读取一张图片
    wx.chooseImage({
      count: 1,
      success:function(res){
        tempFilePath = res.tempFilePaths    //获取临时url
        that.setData({
          filePath:tempFilePath[0],
          ifupload: true,
        })
        console.log(tempFilePath[0])
        wx.getImageInfo({
          src: tempFilePath[0],
          success:function(res){
            imageType = res.type
            console.log(imageType)
            //上传图片
            wx.uploadFile({
              filePath: tempFilePath[0],
              name: 'file',
              url: 'http://127.0.0.1:5000/scan',
              success:function(res){
                //返回base64编码的图片
                if (imageType=='jpeg'){
                  downloadImage = "data:image/JPEG;base64," + res.data
                }else if (imageType=='png'){
                  downloadImage = "data:image/PNG;base64," + res.data
                }
                console.log(downloadImage)
                that.setData({
                  doneImage: downloadImage,
                  loading: '',
                })
                //base64编码转url
                base64src(downloadImage, res=>{
                  downloadImagePath = res
                  console.log(res)
                  //获取图片长宽
                  that.setData({
                    doneUrl: downloadImagePath,
                    loading: '',
                  })
                })
              }
            })
          }
        })
      }
    })
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