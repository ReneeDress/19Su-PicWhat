// miniprogram/pages/filter/filter.js
const ImageFilters = require('../../utils/weImageFilters/weImageFilters.js')
const Helper = require('../../utils/weImageFilters/weImageFiltersHelper.js')

let helper = new Helper({
    canvasId: 'filter',
    width: 300,
    height: 400
})

var id;

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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 0,
    array: [],
    index: 0,//用于picker
    array2: [{ name: '原图'},{ name: '人像'}, { name: '风景'}, { name: '美食'}, { name: '电影'},{ name: '油画'} ],    
    id: 0,             
    //进入页面时，默认选择第0个(即原图)
  },

  choseTxtColor:function(e){
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    this.setData({
      id: id
    })
    //获取图片像素
    let imageData = helper.createImageData()
    let filtered = filters[keys[id]](imageData)
    //绘制到画布上
    helper.putImageData(filtered, () => {
        wx.hideLoading()
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
    //picker选择范围
      array: keys
  })
  },

    choose:function() {
        const z = this
        //选择图片
        wx.chooseImage({
            count: 1,
            success: function (res) {
                if (res.tempFilePaths.length) {
                    let path = res.tempFilePaths[0]
                    helper.initCanvas(path, () => {
                        z.setData({
                            selected: 1
                        })
                    })
                }
            },
        })
    },

    save:function() {
        helper.getImageTempFilePath(tempFilePath => {
            //保存到相册
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: res => {
                    wx.showToast({
                        title: '保存成功',
                    })
                }
            })
        })
    },
})