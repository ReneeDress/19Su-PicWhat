Page({
  data: {
    imgSrc: '', //图片路径
    initialImgSrc: '',//未裁剪前图片路径
    height: 250, //裁剪框高度
    width: 250, //裁剪框宽度
    cut_top: null, //裁剪框上边距
    cut_left: null, //裁剪框左边距
    img_width: null, //图片宽度
    img_height: null, //图片高度
    scale: 1, //图片缩放比
    min_scale: 0.2, //最小缩放比
    max_scale: 3, //最大缩放比
    el: 'myCanvas',
    info: wx.getSystemInfoSync(),
    _touch_img_relative: [{
      x: 0,
      y: 0
    }], //鼠标和图片中心的相对位置
    _hypotenuse_length: 0, //双指触摸时斜边长度
    _flag_img_endtouch: false, //是否结束触摸
    _canvas_width:null,
    _canvas_height:null,
    _img_top: wx.getSystemInfoSync().windowHeight / 2, //图片上边距
    _img_left: wx.getSystemInfoSync().windowWidth / 2, //图片左边距
    watch: {
      imgSrc(value, that){
        that.pushImg();
      }
    }
  },
  onLoad() {
    this.data.info = wx.getSystemInfoSync();
    //启用数据监听
    this._watcher();
    this.setData({
      _canvas_height: this.data.height,
      _canvas_width: this.data.width,
    });
    //初始化画布
    if (!this.data.ctx){
      this.data.ctx = wx.createCanvasContext("myCanvas", this); 
    }
    //设置裁剪框居中
    this.setData({
      cut_top: (this.data.info.windowHeight - this.data.height) * 0.5, //截取的框上边距
      cut_left: (this.data.info.windowWidth - this.data.width) * 0.5, //截取的框左边距
    })
    if(this.data.imgSrc=='')
    {
      wx.showLoading({
      title: '点击传入图片'
      })
    }
  },
    //上传图片
    upload() {
      let that = this;
      wx.chooseImage({
        count: 1,
        success(res) {
          const tempFilePaths = res.tempFilePaths[0];
          that.pushImg(tempFilePaths);
        }
      })
    },
    //加载（更换）图片
    pushImg(src) {
      if (src) {
        this.setData({
          imgSrc: src
        });
        //发现是手动赋值直接返回，交给watch处理
        return;
      }
      // getImageInfo接口传入 src: '' 会导致内存泄漏
      if (!this.data.imgSrc) return;
      wx.getImageInfo({
        src: this.data.imgSrc,
        success: (res) => {
          this.data.imageObject = res;
          //计算最后图片尺寸
          this._imgComputeSize();
          this._draw();
          wx.hideLoading();
        },
      });
    },
    //修改裁剪框比例
    setwidthheight(event){
      this.setData({
        width: event.currentTarget.dataset.width,
        height: event.currentTarget.dataset.height,
        _img_top: wx.getSystemInfoSync().windowHeight / 2,
        _img_left: wx.getSystemInfoSync().windowWidth / 2
      })
      this.onLoad();
      if(this.data.imgSrc!='')
      {
        this._imgComputeSize();
        this._draw();
      }
    },
    //图片边缘检测-位置
    _imgMarginDetectionPosition(scale) {
      let left = this.data._img_left;
      let top = this.data._img_top;
      var scale = scale || this.data.scale;
      let img_width = this.data.img_width;
      let img_height = this.data.img_height;
      left = this.data.cut_left + img_width * scale / 2 >= left ? left : this.data.cut_left + img_width * scale / 2;
      left = this.data.cut_left + this.data.width - img_width * scale / 2 <= left ? left : this.data.cut_left + this.data.width - img_width * scale / 2;
      top = this.data.cut_top + img_height * scale / 2 >= top ? top : this.data.cut_top + img_height * scale / 2;
      top = this.data.cut_top + this.data.height - img_height * scale / 2 <= top ? top : this.data.cut_top + this.data.height - img_height * scale / 2;
      this.setData({
        _img_left: left,
        _img_top: top,
        scale: scale
      })
    },
    //图片边缘检测-缩放
    _imgMarginDetectionScale(){
      let scale = this.data.scale;
      let img_width = this.data.img_width;
      let img_height = this.data.img_height;
      if (img_width * scale < this.data.width){
        scale = this.data.width / img_width;
      }
      if (img_height * scale < this.data.height) {
        scale = Math.max(scale,this.data.height / img_height);
      }
      this._imgMarginDetectionPosition(scale);
    },
    //计算图片尺寸
    _imgComputeSize() {
      let img_width = this.data.img_width,
          img_height = this.data.img_height;
      //默认按图片最小边 = 对应裁剪框尺寸
      img_width = this.data.imageObject.width;
      img_height = this.data.imageObject.height;
      if (img_width / img_height > this.data.width / this.data.height){           //图片的高与裁剪框的高相等
        img_height = this.data.height;
        img_width = this.data.imageObject.width / this.data.imageObject.height * img_height;
      }else{            //图片的宽与裁剪框的宽相等
        img_width = this.data.width;
        img_height = this.data.imageObject.height / this.data.imageObject.width * img_width;
      }
      this.setData({
        img_width: img_width,
        img_height: img_height
      });
    },
    //开始触摸
    _start(event) {
      this.data._flag_img_endtouch = false;
      if (event.touches.length == 1) {
        //单指拖动
        this.data._touch_img_relative[0] = {
          x: (event.touches[0].clientX - this.data._img_left),
          y: (event.touches[0].clientY - this.data._img_top)
        }
      } else {
        //双指放大
        let width = Math.abs(event.touches[0].clientX - event.touches[1].clientX);
        let height = Math.abs(event.touches[0].clientY - event.touches[1].clientY);
        this.data._touch_img_relative = [{
          x: (event.touches[0].clientX - this.data._img_left),
          y: (event.touches[0].clientY - this.data._img_top)
        }, {
          x: (event.touches[1].clientX - this.data._img_left),
          y: (event.touches[1].clientY - this.data._img_top)
        }];
        this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
      }
      this._draw();
    },
    _move(event) {
      if (this.data._flag_img_endtouch) return;
      if (event.touches.length == 1) {
        //单指拖动
        let left = (event.touches[0].clientX - this.data._touch_img_relative[0].x),
            top = (event.touches[0].clientY - this.data._touch_img_relative[0].y);
        //图像边缘检测,防止截取到空白
        this.data._img_left = left;
        this.data._img_top = top;
        this._imgMarginDetectionPosition();
        this.setData({ //更新视图
          _img_left: this.data._img_left,
          _img_top: this.data._img_top
        });
      } else {
        //双指放大
        let width = (Math.abs(event.touches[0].clientX - event.touches[1].clientX)),
            height = (Math.abs(event.touches[0].clientY - event.touches[1].clientY)),
            hypotenuse = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
            scale = this.data.scale * (hypotenuse / this.data._hypotenuse_length);
        scale = scale <= this.data.min_scale ? this.data.min_scale : scale;
        scale = scale >= this.data.max_scale ? this.data.max_scale : scale;
        //图像边缘检测,防止截取到空白
        this.data.scale = scale;
        this._imgMarginDetectionScale();
        let _touch_img_relative = [{
          x: (event.touches[0].clientX - this.data._img_left),
          y: (event.touches[0].clientY - this.data._img_top)
        }, {
          x: (event.touches[1].clientX - this.data._img_left),
          y: (event.touches[1].clientY - this.data._img_top)
        }];
        this.data._touch_img_relative = _touch_img_relative;
        this.data._hypotenuse_length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        this.setData({  //更新视图
          scale: this.data.scale
        });
      }
      this._draw();
    },
    //结束操作
    _end(event) {
      this.data._flag_img_endtouch = true;
    },
    //点击中间剪裁框处理
    _click() {
      if (!this.data.imgSrc) {
        //调起上传
        this.upload();
        return;
      }
    },
    _preview(){
      this._draw(()=>{
        //把当前画布指定区域的内容导出生成指定大小的图片
        wx.canvasToTempFilePath({
          width: this.data.width * 3,
          height: Math.round(this.data.height * 3),
          canvasId: this.data.el,
          success: (res) => {
            wx.previewImage({
              current: res.tempFilePath, // 当前显示图片的http链接
              urls: [res.tempFilePath] // 需要预览的图片http链接列表
            })
          }
        }, this)
      });
    },
    cutsuccess(){
      this._draw(()=>{
        //把当前画布指定区域的内容导出生成指定大小的图片
        wx.canvasToTempFilePath({
          width: this.data.width * 3,
          height: Math.round(this.data.height * 3),
          canvasId: this.data.el,
          success: (res) => {
            this.data.imageObject = res;
            this.setData({
              initialImgSrc: this.data.imgSrc,
              imgSrc: res.tempFilePath,
              _img_top: wx.getSystemInfoSync().windowHeight / 2,
              _img_left: wx.getSystemInfoSync().windowWidth / 2,
              scale: 1
            });
            if(this.data.imgSrc!='')
            {
              console.log(this.data);
              this._imgComputeSize();
              this._draw();
            }
          }
        }, this)
      });
    },
    //渲染
    _draw(callback) {
      if (!this.data.imgSrc) return;
      let draw = () => {
        //图片实际大小
        let img_width = this.data.img_width * this.data.scale * 3;
        let img_height = this.data.img_height * this.data.scale * 3;
        //canvas和图片的相对距离
        var xpos = this.data._img_left - this.data.cut_left;
        var ypos = this.data._img_top - this.data.cut_top;
        //平移画布
        this.data.ctx.translate(xpos * 3, ypos * 3);
        this.data.ctx.drawImage(this.data.imgSrc, -img_width / 2, -img_height / 2, img_width, img_height);
        this.data.ctx.draw(false, () => {
            callback && callback();
        });
      }
      draw();
    },
    //监听器
    _watcher() {
      Object.keys(this.data).forEach(v => {
        this._observe(this.data, v, this.data.watch[v]);
      })
    },
    _observe(obj, key, watchFun) {
      var val = obj[key];
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set:(value) => {
          val = value;
          watchFun && watchFun(val, this);
        },
        get() {
          if (val && '_img_top|img_left|width|height|cut_top|cut_left|img_width|img_height|scale|min_scale|max_scale'.indexOf(key)!=-1){
            let ret = parseFloat(parseFloat(val).toFixed(3));
            if (typeof val == "string" && val.indexOf("%") != -1){
              ret+='%';
            }
            return ret;
          }
          return val;
        }
      })
    }
})
