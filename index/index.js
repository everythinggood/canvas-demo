const app = getApp()

Page({
  data: {},

  onLoad: function() {
    this.position = {
      x: 150,
      y: 150,
      vx: 2,
      vy: 2
    }
    this.x = -100
    this.imageWidth = 10
    this.imageOriginWidth = 50
    this.alpha = 1
    this.t = 0

    // 通过 SelectorQuery 获取 Canvas 节点
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))


    // for (var i = 0.1; i <= 1; i = i + 0.1) {
    //   console.log(this.threeBezier(i, [100, 0], [300, 300], [100, 0], [200, 300]))
    // }
  },

  init(res) {
    this.width = res[0].width
    this.height = res[0].height
    this.dx = this.width / 2 - 50
    this.dy = 50
    this._imgs = []

    const canvas = res[0].node
    const ctx = canvas.getContext('2d')

    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = this.width * dpr
    canvas.height = this.height * dpr
    ctx.scale(dpr, dpr)

    const renderLoop = () => {
      this.render(canvas, ctx)
      canvas.requestAnimationFrame(renderLoop)
    }
    canvas.requestAnimationFrame(renderLoop)

    const img = canvas.createImage()
    img.onload = () => {
      this._img = img
    }
    img.src = './car.png'
  },
  render(canvas, ctx) {
    ctx.clearRect(0, 0, this.width, this.height)
    this.drawCar(ctx)
  },
  drawCar(ctx) {
    if (!this._img) {
      return
    }
    if (this.dy > 300) {
      // return
      this.t = 0;
      this.imageWidth = 20;
      this.dy = 50;
      this.dx = this.width / 2;
      this.alpha = 1
    }
    ctx.globalAlpha = this.alpha
    ctx.drawImage(this._img, this.dx, this.height - this.dy, this.imageWidth, this.imageWidth / 2)
    this.t = this.t + 0.01
    this.setDxDy()
    this.setImageWidth()
    this.setAlpha()
    // ctx.restore()
  },
  setDxDy() {
    if (this.t > 1) {
      return
    }
    // console.log(this.t)
    let [x, y] = this.threeBezier(this.t, [100, 50], [300, 305], [100, 0], [200, 300])
    this.dx = x
    this.dy = y
  },
  setImageWidth() {
    if (this.imageOriginWidth < this.imageWidth) {
      return
    }
    this.imageWidth = this.imageWidth + 2
  },
  setAlpha() {
    if (this.dy > 150) {
      this.alpha = this.alpha - 0.03
      if (this.alpha < 0) {
        this.alpha = 0
      }
    }
  },
  /**
   * @desc 三阶贝塞尔
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} p2 终点坐标
   * @param {Array} cp1 控制点1
   * @param {Array} cp2 控制点2
   */
  threeBezier(t, p1, p2, cp1, cp2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    const [cx1, cy1] = cp1;
    const [cx2, cy2] = cp2;
    let x =
      x1 * (1 - t) * (1 - t) * (1 - t) +
      3 * cx1 * t * (1 - t) * (1 - t) +
      3 * cx2 * t * t * (1 - t) +
      x2 * t * t * t;
    let y =
      y1 * (1 - t) * (1 - t) * (1 - t) +
      3 * cy1 * t * (1 - t) * (1 - t) +
      3 * cy2 * t * t * (1 - t) +
      y2 * t * t * t;
    return [x, y];
  }

})