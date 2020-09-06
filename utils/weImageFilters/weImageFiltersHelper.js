const ImageFilters = require('./weImageFilters.js')

let Helper = function(options) {
    /**
     * options{canvasId, width, height}
     */
    this.originalImageData = null
    this.canvasInfo = {
        canvasId: options.canvasId,
        width: options.width,
        height: options.height
    }
}

// 保存当前的画布像素信息到 originalImageData
Helper.prototype.saveImageData = function(cb) {
    const z = this

    // 获取canvas像素数据
    wx.canvasGetImageData({
        canvasId: z.canvasInfo.canvasId,
        x: 0,
        y: 0,
        width: z.canvasInfo.width,
        height: z.canvasInfo.height,
        success: res => {
            console.log(res)
            let {
                data
            } = res

            z.originalImageData = data
            if (cb) {
                cb()
            }
        }
    })
}

// 初始化画布内容
Helper.prototype.initCanvas = function(tempFilePath, width, height, cb) {
    const z = this
    const ctx = wx.createCanvasContext(z.canvasInfo.canvasId)
    console.log(tempFilePath)
    if (height/width >= 552/400) {
        ctx.drawImage(tempFilePath, (z.canvasInfo.width-(z.canvasInfo.height/height)*width)/2, 0, (z.canvasInfo.height/height)*width, z.canvasInfo.height)
        ctx.draw(false, () => {
            console.log('draw done')

            z.saveImageData(cb)
        })
    }
    else {
        ctx.drawImage(tempFilePath, 0, (z.canvasInfo.height-(z.canvasInfo.width/width)*height)/2, z.canvasInfo.width, (z.canvasInfo.width/width)*height)
        ctx.draw(false, () => {
            console.log('draw done')
            console.log('2')
            z.saveImageData(cb)
        })
    }
    
}

// 更新canvas信息
Helper.prototype.updateCanvasInfo = function (options) {
    if (options.canvasId) {
        this.canvasInfo.canvasId = options.canvasId
    }
    if (options.width) {
        this.canvasInfo.width = options.width
    }
    if (options.height) {
        this.canvasInfo.height = options.height
    }
    if (options.tempFilePath) {
        this.initCanvas(options.tempFilePath)
    }
}

// 从originalImageData创建 imageData
Helper.prototype.createImageData = function() {
    const z = this
    return ImageFilters.utils.createImageDataFromData(z.originalImageData, z.canvasInfo.width, z.canvasInfo.height)
}

Helper.prototype.putImageData = function(imageData, cb) {
    const z = this
    // 将像素数据绘制到画布
    wx.canvasPutImageData({
        canvasId: z.canvasInfo.canvasId,
        data: imageData.data,
        x: 0,
        y: 0,
        width: z.canvasInfo.width,
        height: z.canvasInfo.height,
        complete: res => {
            if (cb) {
                cb()
            }
        }
    })
}

Helper.prototype.getImageTempFilePath = function (width, height, cb) {
    const z = this
    // 将画布内容保存为图片
    if (height/width >= 552/400) {
        wx.canvasToTempFilePath({
            x: (z.canvasInfo.width-(z.canvasInfo.height/height)*width)/2,
            y: 0,
            width: (z.canvasInfo.height/height)*width,
            height: z.canvasInfo.height,
            destWidth: width,
            destHeight: height,
            canvasId: z.canvasInfo.canvasId,
            success: function (res) {
                cb(res.tempFilePath)
            }
        })
    }
    else {
        wx.canvasToTempFilePath({
            x: 0,
            y: (z.canvasInfo.height-(z.canvasInfo.width/width)*height)/2,
            width: z.canvasInfo.width,
            height: (z.canvasInfo.width/width)*height,
            destWidth: width,
            destHeight: height,
            canvasId: z.canvasInfo.canvasId,
            success: function (res) {
                cb(res.tempFilePath)
            }
        })
    }
   
}

module.exports = Helper