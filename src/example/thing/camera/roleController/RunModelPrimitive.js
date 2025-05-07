class RunModelPrimitive extends mars3d.graphic.ModelPrimitive {
  constructor(options = {}) {
    super(options)

    this._speed = this.options.speed ?? 1
    this._radian = this.options.radian ?? 1

    // 内部变量
    this._flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    }
    this._keydownFlag = false
    this._speedVector = new Cesium.Cartesian3()
  }

  //= ========= 方法 ==========
  // 开启和关闭的回调
  _showHook(val) {
    if (val) {
      this._bindEvent()
    } else {
      this._unbindEvent()
    }
    super._showHook(val)
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   * @private
   */
  _addedHook(style) {
    super._addedHook(style)

    this.readyPromise.then(() => {
      if (this.options.style.animation) {
        this._primitive.activeAnimations.add({
          name: this.options.style.animation,
          loop: Cesium.ModelAnimationLoop.REPEAT
        })
      }

      this._map.clock.shouldAnimate = false
    })

    this._bindEvent()
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   * @private
   */
  _removedHook() {
    super._removedHook()

    this._unbindEvent()
  }

  // 绑定事件
  _bindEvent() {
    this._unbindEvent()

    this._map.on(mars3d.EventType.keydown, this._keydownHandler, this)
    this._map.on(mars3d.EventType.keyup, this._keyupHandler, this)
    this._map.on(mars3d.EventType.clockTick, this._clockTickHandler, this)

    this._map.trackedEntity = this
  }

  _unbindEvent() {
    this._map.trackedEntity = undefined

    this._map.off(mars3d.EventType.keydown, this._keydownHandler, this)
    this._map.off(mars3d.EventType.keyup, this._keyupHandler, this)
    this._map.off(mars3d.EventType.clockTick, this._clockTickHandler, this)
  }

  _keydownHandler(e) {
    this.setFlagStatus(e, true)
  }

  _keyupHandler(e) {
    this.setFlagStatus(e, false)
  }

  _clockTickHandler(e) {
    if (this._flag.moveUp) {
      if (this._flag.moveLeft) {
        this.heading -= this._radian
      }

      if (this._flag.moveRight) {
        this.heading += this._radian
      }
      this.move(true)
    }

    if (this._flag.moveDown) {
      if (this._flag.moveLeft) {
        this.heading -= this._radian
      }

      if (this._flag.moveRight) {
        this.heading += this._radian
      }
      this.move(false)
    }

    if (this._flag.moveLeft && !this._flag.moveDown && !this._flag.moveUp && !this._flag.moveRight) {
      this.heading -= this._radian
    }

    if (this._flag.moveRight && !this._flag.moveDown && !this._flag.moveUp && !this._flag.moveLeft) {
      this.heading += this._radian
    }
  }

  setFlagStatus(key, value) {
    switch (key.keyCode) {
      case 65:
        this._flag.moveLeft = value
        break
      case 87:
        this.validateKey(value)
        this._flag.moveUp = value
        break
      case 68:
        this._flag.moveRight = value
        break
      case 83:
        this.validateKey(value)
        this._flag.moveDown = value
        break
    }
  }

  validateKey(value) {
    this._map.clock.shouldAnimate = value
    this._keydownFlag = value
  }

  move(isUP) {
    if (isUP > 0) {
      this._speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_Y, this._speed, this._speedVector)
    } else {
      this._speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_Y, -this._speed, this._speedVector)
    }
    this.position = Cesium.Matrix4.multiplyByPoint(this._primitive.modelMatrix, this._speedVector, new Cesium.Cartesian3())
  }
}
