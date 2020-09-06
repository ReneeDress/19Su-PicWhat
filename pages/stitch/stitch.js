// pages/stitch/stitch.js
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
    if (app.globalData.url != null) {
      wx.showToast({
        title: '图片拼接不支持继续编辑',
        duration: 3000,
        icon: 'none'
      })
      app.globalData.url = null
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
  //事件处理函数
  upload: function() {
    let that = this
    var tempFilePath                        // 存储图片路径
    var downloadImage                       // 存储返回base64编码图像
    var downloadImagePath                   // 存储图像url
    var ImageArray=[]                       // 存储上传图像组路径
    that.setData({
      ifupload: false,
      doneImage: '',
      loading: '正在处理...'
    })
    //图片拼接函数
    var request = function(ImageArray){
      wx.request({
        url: 'http://127.0.0.1:5000/joint/auto',
        method: 'GET',
        data: {'data':ImageArray},
        success:function(res){
          downloadImage = "data:image/JPEG;base64," + res.data
          that.setData({
            doneImage: downloadImage,
            loading: '',
          })
          console.log(downloadImage)
          base64src(downloadImage, res=>{
            downloadImagePath = res
            console.log(downloadImagePath)
            that.setData({
              loading: '',
              doneUrl: downloadImagePath,
            })
            // wx.previewImage({
            //   urls:[downloadImagePath]
            // })
          })
        }
      })
    }
    //多图片顺序上传函数
    var upload = function(i, tempFilePath){
      wx.uploadFile({
        filePath: tempFilePath[i],
        name: 'photo',
        url: 'http://127.0.0.1:5000/upload/multi',
        success:function(res){
          console.log(i)
          // 图像全部上传完毕
          console.log(JSON.parse(res.data))
          var jsonObj = JSON.parse(res.data)
          ImageArray.push(jsonObj.filepath)
          console.log(ImageArray)
          // 递归结束
          if (i==tempFilePath.length-1){
            that.setData({
              ImageArray: ImageArray,
            })
            request(ImageArray)
          }
          else{
            i=i+1
            upload(i, tempFilePath)
          }
        }
      })
    }
    wx.chooseImage({
      count: 9,
      success:function(res){
        that.setData({
          ifupload: true,
        })
        tempFilePath = res.tempFilePaths
        // 依次上传所有图像
        var i=0
        upload(i,tempFilePath)
      }
    })
  },

  // //点击 选择图片 按钮
  // choose_image:function(e){
  //   var that=this
  //   var tempFilePath
  //   var downloadImagePath
  //   var downloadImage
  //   var imagewidth
  //   var imageheight
  //   var imageType
  //   let json
  //   //创建canvas的绘图上下文对象
  //   var ctx = wx.createCanvasContext('firstcanvas')
  //   this.setData({
  //     ifupload: false,
  //     doneImage: '',
  //     loading: '正在加载...',
  //     none: 'flex',
  //   })
  //   //读取一张图片
  //   wx.chooseImage({
  //     count: 1,
  //     // sizeType: ['original', 'compressed'],
  //     // sourceType: ['album', 'camera'],
  //     success: function(res){
  //       tempFilePath = res.tempFilePaths    //获取临时url
  //       that.setData({
  //         url: tempFilePath[0],
  //         ifupload: true,
  //       })
  //       console.log(tempFilePath[0])
  //       wx.getImageInfo({
  //         src: that.data.url,
  //         success: function(res){
  //           imageType = res.type
  //           console.log(res)
  //           console.log(imageType)
  //           wx.uploadFile({
  //             filePath: tempFilePath[0],
  //             name: 'file',
  //             url: 'http://127.0.0.1:5000/upload',
  //             success: function(res){
  //               console.log(JSON.parse(res.data))
  //               json = JSON.parse(res.data)
  //               // 返回base64编码的图片
  //               if (imageType=='jpeg'){
  //                 downloadImage = "data:image/JPEG;base64," + json['b64']
  //               }else if (imageType=='png'){
  //                 downloadImage = "data:image/PNG;base64," + json['b64']
  //               }
  //               that.setData({
  //                 doneImage: downloadImage,
  //                 doneUrl: json['path'],
  //                 none: 'none',
  //                 loading: '',
  //               })
  //               // that.identity()
  //               // // console.log(downloadImage)
  //               // // base64编码转url
  //               // base64src(downloadImage, res=>{
  //               //   downloadImagePath = res
  //               //   console.log(downloadImagePath)
  //               //   that.setData({
  //               //     doneUrl: downloadImagePath
  //               //   })
  //               //   console.log(that.data.doneUrl)
  //               // })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // },

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
  one: function () {
    this.setData({
      ifone: '#f7971e',
      iftwo: 'transparent',
      ifthr: 'transparent',
      loading: '正在处理...',
      doneImage: '',
    })
    let that = this
    let ImageArray = this.data.ImageArray
    let downloadImage
    let downloadImagePath
    //图片拼接函数
    wx.request({
      url: 'http://127.0.0.1:5000/joint/auto',
      method: 'GET',
      data: {'data':ImageArray},
      success:function(res){
        downloadImage = "data:image/JPEG;base64," + res.data
        // that.setData({
        //   doneImage: downloadImage
        // })
        console.log(downloadImage)
        that.setData({
          doneImage: downloadImage,
          loading: '',
        })
        base64src(downloadImage, res=>{
          downloadImagePath = res
          console.log(downloadImagePath)
          that.setData({
            loading: '',
            doneUrl: downloadImagePath,
          })
          // wx.previewImage({
          //   urls:[downloadImagePath]
          // })
        })
      }
    })
  },
  two: function () {
    this.setData({
      ifone: 'transparent',
      iftwo: '#f7971e',
      ifthr: 'transparent',
      loading: '正在处理...',
      doneImage: '',
    })
    let that = this
    let ImageArray = this.data.ImageArray
    let downloadImage
    let downloadImagePath
    //图片拼接函数
    wx.request({
      url: 'http://127.0.0.1:5000/joint/normal',
      method: 'GET',
      data: {'data':ImageArray},
      success:function(res){
        downloadImage = "data:image/JPEG;base64," + res.data
        // that.setData({
        //   doneImage: downloadImage
        // })
        console.log(downloadImage)
        that.setData({
          doneImage: downloadImage,
          loading: '',
        })
        base64src(downloadImage, res=>{
          downloadImagePath = res
          console.log(downloadImagePath)
          that.setData({
            loading: '',
            doneUrl: downloadImagePath,
          })
          // wx.previewImage({
          //   urls:[downloadImagePath]
          // })
        })
      }
    })
  },
  thr: function () {
    this.setData({
      ifone: 'transparent',
      iftwo: 'transparent',
      ifthr: '#f7971e',
      loading: '正在处理...',
      doneImage: '',
    })
    let that = this
    let ImageArray = this.data.ImageArray
    let downloadImage
    let downloadImagePath
    //图片拼接函数
    wx.request({
      url: 'http://127.0.0.1:5000/joint/normal2',
      method: 'GET',
      data: {'data':ImageArray},
      success:function(res){
        downloadImage = "data:image/JPEG;base64," + res.data
        // that.setData({
        //   doneImage: downloadImage
        // })
        console.log(downloadImage)
        that.setData({
          doneImage: downloadImage,
          loading: '',
        })
        base64src(downloadImage, res=>{
          downloadImagePath = res
          console.log(downloadImagePath)
          that.setData({
            loading: '',
            doneUrl: downloadImagePath,
          })
          // wx.previewImage({
          //   urls:[downloadImagePath]
          // })
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