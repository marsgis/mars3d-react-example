const parameter = {
  fillStyle: "#8f8ffa40",
  strokeStyle: "#0063ff",
  radius: 4
}

class CanvasEdit {
  constructor(canvas) {
    this._canvas = canvas
    this._points = []
    canvas.oncontextmenu = function (ev) {
      ev.preventDefault()
      return false
    }
    this._ctx = canvas.getContext("2d")
    this._canvas.addEventListener("mousedown", this.mousedownHandler.bind(this))
    this._canvas.addEventListener("mouseup", () => {
      this._pickIndex = undefined
    })
    this._canvas.addEventListener("mousemove", this.mousemoveHandler.bind(this))
    this._draw = false
    this._canEdit = false
    this._pickIndex = undefined

    this.uvList = [
      [0, 1],
      [1, 1],
      [1, 0],
      [0, 0]
    ]
  }

  // 开始绘制模式
  draw() {
    this.clear()
    this._draw = true
    this._pickIndex = undefined
  }

  // 清除点
  clear() {
    this._points = []
    this.update()
  }

  // 开始编辑状态
  edit(canEdit) {
    console.log("canEdit", canEdit)
    this._draw = false
    this._canEdit = canEdit
  }

  // 通过UV坐标集合更新点
  setPointsRorUvs(uvs) {
    this._points = []
    uvs.forEach((uv) => {
      this._points.push({
        x: uv[0] * this._canvas.width,
        y: this._canvas.height - uv[1] * this._canvas.height
      })
    })
    this.update()
  }

  mousemoveHandler(event) {
    if (this._pickIndex !== undefined) {
      this._points[this._pickIndex] = {
        x: event.offsetX,
        y: event.offsetY
      }
      this.update()
    }
  }

  mousedownHandler(event) {
    if (event.button === 0) {
      if (this._draw) {
        // 如果处于绘制状态则左键按下为绘制点
        this._points.push({
          x: event.offsetX,
          y: event.offsetY
        })
        this.update()
      } else if (!this._draw && this._canEdit) {
        // 如果不处于绘制状态，则左键按下为编辑点
        for (let i = 0; i < this._points.length; i++) {
          const x = this._points[i].x - event.offsetX
          const y = this._points[i].y - event.offsetY
          const distance = Math.sqrt(x * x + y * y)
          if (distance <= parameter.radius) {
            this._pickIndex = i
            break
          }
        }
      }
    }
  }

  update() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
    if (this._points.length > 0) {
      this._ctx.fillStyle = parameter.fillStyle
      this._ctx.strokeStyle = parameter.strokeStyle
      // 绘制面和边界
      this._ctx.beginPath()
      this._ctx.moveTo(this._points[0].x, this._points[0].y)
      for (let i = 1; i < this._points.length; i++) {
        this._ctx.lineTo(this._points[i].x, this._points[i].y)
      }
      this._ctx.closePath()
      this._ctx.stroke()
      this._ctx.fill()
      // 绘制节点
      this._points.forEach((point) => {
        this._ctx.beginPath()
        this._ctx.arc(point.x, point.y, parameter.radius, 0, 2 * Math.PI)
        this._ctx.stroke()
      })
    }
    this.uvList = this.getUvForPoints()
    console.log("uv集合:", this.getUvForPoints())
  }

  getUvForPoints() {
    return this._points.map((p) => {
      return [p.x / this._canvas.width, (this._canvas.height - p.y) / this._canvas.height]
    })
  }
}
