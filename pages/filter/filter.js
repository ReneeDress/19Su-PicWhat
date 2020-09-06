// pages/filter/filter.js
const ImageFilters = require('../../utils/weImageFilters/weImageFilters.js')
const Helper = require('../../utils/weImageFilters/weImageFiltersHelper.js')

var id;
let helper = new Helper({canvasId: 'filter', width: 400, height: 552})
//全部滤镜
//data:像素数据
const filters = {
    original: function (data) {
        return data
    },
    Enrich: function (data) {
        return ImageFilters.Enrich(data)
    },
    BrightnessContrastPhotoshop: function (data) {
        return ImageFilters.BrightnessContrastPhotoshop(data, 26, 13)
    },
    BrightnessContrastGimp: function (data) {
        return ImageFilters.BrightnessContrastGimp(data, 26, 13)
    },
    Sepia: function (data) {
        return ImageFilters.Sepia(data)
    },
    Oil: function (data) {
        return ImageFilters.Oil(data, 5, 62)
    },
    Binarize: function (data) {
        return ImageFilters.Binarize(data, 0.5)
    },
    BoxBlur: function (data) {
        return ImageFilters.BoxBlur(data, 3, 3, 2)
    },
    GaussianBlur: function (data) {
        return ImageFilters.GaussianBlur(data, 4)
    },
    StackBlur: function (data) {
        return ImageFilters.StackBlur(data, 6)
    },
    Brightness: function (data) {
        return ImageFilters.Brightness(data, 100)
    },
    Channels: function (data) {
        return ImageFilters.Channels(data, 3)
    },
    ColorTransformFilter: function (data) {
        return ImageFilters.ColorTransformFilter(data, 2, 1, 1, 1, 38, 0, 0, 0)
    },
    Desaturate: function (data) {
        return ImageFilters.Desaturate(data)
    },
    Dither: function (data) {
        return ImageFilters.Dither(data, 2)
    },
    Edge: function (data) {
        return ImageFilters.Edge(data)
    },
    Emboss: function (data) {
        return ImageFilters.Emboss(data)
    },
    Flip: function (data) {
        return ImageFilters.Flip(data, 0)
    },
    Gamma: function (data) {
        return ImageFilters.Gamma(data, 5)
    },
    GrayScale: function (data) {
        return ImageFilters.GrayScale(data)
    },
    HSLAdjustment: function (data) {
        return ImageFilters.HSLAdjustment(data, -23, 54, 19)
    },
    Invert: function (data) {
        return ImageFilters.Invert(data)
    },
    Mosaic: function (data) {
        return ImageFilters.Mosaic(data, 10)
    },
    OpacityFilter: function (data) {
        return ImageFilters.OpacityFilter(data, 123)
    },
    Posterize: function (data) {
        return ImageFilters.Posterize(data, 6)
    },
    Rescale: function (data) {
        return ImageFilters.Rescale(data, 3.2)
    },
    Sharpen: function (data) {
        return ImageFilters.Sharpen(data, 9)
    },
    Solarize: function (data) {
        return ImageFilters.Solarize(data)
    },
    Transpose: function (data) {
        return ImageFilters.Transpose(data)
    },
    Twril: function (data) {
        return ImageFilters.Twril(data, 0.5, 0.5, 120, 90, 0, true)
    },
}

const keys = Object.keys(filters)

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
    ifone: '#2193b0',
    iftwo: 'transparent',
    ifthr: 'transparent',
    showone: false,
    showtwo: false,
    showthr: false,
    back: '<',
    filter: ['原图', '人像', '风景', '美食', '电影', '油画'],
    film: ['原图', '250D', '500D', '5205', '5218', 'F125'],
    cur: 0,
    imgWidth: 0,
    imgHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.url != null) {
      this.setData({
        url: app.globalData.url,
        doneUrl: app.globalData.url,
        doneImage: app.globalData.url,
        ifupload: true,
        loading: '',
      })
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
    //读取一张图片
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'],
      // sourceType: ['album', 'camera'],
      success: function(res){
        tempFilePath = res.tempFilePaths    //获取临时url
        console.log(res)
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
            helper.initCanvas(tempFilePath[0], res.width, res.height, () => {
              that.setData({
                  selected: 1
              })
            })
            that.setData({
              imgWidth: res.width,
              imgHeight: res.height,
            })
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
                  doneImage: downloadImage,
                  doneUrl: json['path'],
                  none: 'none',
                  loading: '',
                })
                // that.identity()
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
    // this.setData({
    //   ifupload: false
    // })
  },
  one: function (e) {
    let temp = this.data.doneImage
    let that = this
    this.setData({
      ifone: '#2193b0',
      iftwo: 'transparent',
      ifthr: 'transparent',
      showone: true,
      temp: temp,
      doneImage: '',
      loading: '正在加载...'
    })
    //获取图片像素
    let imageData = helper.createImageData()
    console.log(imageData)
    let filtered = filters[keys[e.currentTarget.id]](imageData)
    console.log(keys[0])
    //绘制到画布上
    helper.putImageData(filtered, () => {
        wx.hideLoading()
        that.setData({
          loadinng: ''
        })
    })
  },
  two: function () {
    this.setData({
      ifone: 'transparent',
      iftwo: '#2193b0',
      ifthr: 'transparent',
      showtwo: true,
      doneImage: this.data.temp,
    })
  },
  thr: function () {
    this.setData({
      ifone: 'transparent',
      iftwo: 'transparent',
      ifthr: '#2193b0',
      showthr: true,
    })
  },
  disone: function () {
    this.setData({
      loading: '正在加载...',
    })
    let width = this.data.imgWidth
    let height = this.data.imgHeight
    let that = this
    helper.getImageTempFilePath(width, height, tempFilePath => {
        //获取临时链接
        console.log(tempFilePath)
        that.setData({
          doneImage: tempFilePath,
          showone: false,
          loading: ''
        })
    })
    // if (height/width >= 552/400) {
    //   wx.canvasToTempFilePath({
    //     x: ((that.data.windowWidth)*0.96-((that.data.windowHeight)*0.75/height)*width)/2,
    //     y: 0,
    //     width: ((that.data.windowHeight)*0.75/height)*width,
    //     height: (that.data.windowHeight)*0.75,
    //     destWidth: width,
    //     destHeight: height,
    //     canvasId: 'filter',
    //     success: function(res) {
    //       console.log(res.tempFilePath)
    //       that.setData({
    //         doneImage: res.tempFilePath,
    //         loading: '',
    //       })
    //     } 
    //   })
    // }
    // else {
    //   wx.canvasToTempFilePath({
    //     x: 0,
    //     y: ((that.data.windowHeight)*0.75-((that.data.windowWidth)*0.96/width)*height)/2,
    //     width: (that.data.windowWidth)*0.96,
    //     height: ((that.data.windowWidth)*0.96/width)*height,
    //     destWidth: width,
    //     destHeight: height,
    //     canvasId: 'filter',
    //     success: function(res) {
    //       console.log(res.tempFilePath)
    //       that.setData({
    //         doneImage: res.tempFilePath,
    //         loading: '',
    //       })
    //     } 
    //   })
    // }
  },
  distwo: function () {
    this.setData({
      showtwo: false,
    })
  },
  filter: function (e) {
    console.log(e.currentTarget)
    console.log(e.currentTarget.id)
    this.setData({
      cur: e.currentTarget.id,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
    let that = this
    //获取图片像素
    let imageData = helper.createImageData()
    console.log(imageData)
    let filtered = filters[keys[e.currentTarget.id]](imageData)
    console.log(keys[this.data.cur])
    //绘制到画布上
    helper.putImageData(filtered, () => {
        wx.hideLoading()
        that.setData({
          doneImage: '',
          loading: '',
          none: 'none',
        })
    })
    
  },
  film: function (e) {
    console.log(e.currentTarget.id)
    this.setData({
      cur: e.currentTarget.id,
      doneImage: '',
      loading: '正在加载...',
      none: 'flex',
    })
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
              url: 'http://127.0.0.1:5000/film',
              data: {   //将数据格式转为JSON
                imgTempUrl: JSON.stringify(that.data.doneUrl),
                index: JSON.stringify(that.data.cur),
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'chartset': 'utf-8'
              },
              success: function(res){
                console.log(res.data)
                // 返回base64编码的图片
                if (imageType=='jpeg'){
                  downloadImage = "data:image/JPEG;base64," + res.data
                }else if (imageType=='png'){
                  downloadImage = "data:image/PNG;base64," + res.data
                }
                that.setData({
                  doneImage: downloadImage,
                  // doneUrl: downloadImage,
                  none: 'none',
                  loading: '',
                })
              }
            })
          }
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