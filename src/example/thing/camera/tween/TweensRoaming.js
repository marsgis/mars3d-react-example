/**
 * 基于Tweens插值的自定义漫游
 */
class TweensRoaming extends mars3d.BaseThing {
  constructor(options) {
    super(options)

    this._tweens = []
  }

  /**
   * 漫游坐标列表
   * @type {object[]}
   * @readonly
   */
  get points() {
    return this.options.points
  }

  set points(value) {
    this.options.points = value
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   * @private
   */
  _addedHook() {
    //
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   * @private
   */
  _removedHook() {
    this.stop()
  }

  /**
   * 开始漫游
   */
  start() {
    this._map.scene.camera.cancelFlight()
    this.stop()

    this._tweens = this._createTweens()

    if (this._tweens.length === 0) {
      return
    }

    this._oldShouldAnimate = this._map.clock.shouldAnimate
    this._oldStartTime = this._map.clock.startTime.clone()
    this._oldCurrentTime = this._map.clock.currentTime.clone()
    this._oldClockRange = this._map.clock.clockRange

    const currentTime = this._map.clock.currentTime.clone()
    this._map.clock.startTime = currentTime
    this._map.clock.clockRange = Cesium.ClockRange.UNBOUNDED
    this._map.clock.shouldAnimate = true

    const now = Cesium.JulianDate.toDate(currentTime)
    const nowTimestamp = now.getTime()
    this._tweens[0].start(nowTimestamp)

    this._map.scene.screenSpaceCameraController.enableInputs = false
    this._map.on(mars3d.EventType.preUpdate, this._map_preUpdateHandler, this)
  }

  /**
   * 停止漫游
   */
  stop() {
    this._map.off(mars3d.EventType.preUpdate, this._map_preUpdateHandler, this)

    if (this._tweens && this._tweens.length > 0) {
      for (let index = 0; index < this._tweens.length; index++) {
        const tween = this._tweens[index]
        tween.stop()
      }
      this._tweens = []
    }

    this._restoreClockState()
  }

  /**
   * 暂停漫游
   */
  pause() {
    this._map.clock.shouldAnimate = false
  }

  /**
   * 恢复漫游
   */
  resume() {
    this._map.clock.shouldAnimate = true
  }

  _createTweens() {
    const views = this.points
    const m = views.length - 1

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    const tweens = []

    for (let i = 0; i < m; i++) {
      const i0 = i - 1 < 0 ? 0 : i - 1
      const i1 = i
      const i2 = i + 1 > m ? m : i + 1
      const i3 = i + 2 > m ? m : i + 2

      const startObject = {
        lng: views[i0].lng,
        lat: views[i0].lat,
        alt: views[i0].alt,
        heading: views[i0].heading,
        pitch: views[i0].pitch
      }
      const stopObject = {
        lng: [views[i1].lng, views[i2].lng, views[i3].lng],
        lat: [views[i1].lat, views[i2].lat, views[i3].lat],
        alt: [views[i1].alt, views[i2].alt, views[i3].alt],
        heading: [views[i1].heading, views[i2].heading, views[i3].heading],
        pitch: [views[i1].pitch, views[i2].pitch, views[i3].pitch]
      }

      const duration = Cesium.defaultValue(views[i1].duration, 3) * 1000
      const delay = Cesium.defaultValue(views[i1].stop, 0) * 1000
      // eslint-disable-next-line no-undef
      const easingFunction = Cesium.defaultValue(views[i1].easingFunction, Tween.Easing.Linear.None)

      // eslint-disable-next-line no-undef
      const tween = new Tween.Tween(startObject)
        .to(stopObject, duration)
        .delay(delay)
        .easing(easingFunction)
        .interpolation(catmullRom)
        .onUpdate(function (elapsed) {
          if (!that._map.clock.shouldAnimate) {
            return
          }

          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const roamingView = this
          that._updateCamera(roamingView)
        })

      tween.onComplete(() => {
        startObject.lng = views[i0].lng
        startObject.lat = views[i0].lat
        startObject.alt = views[i0].alt
        startObject.heading = views[i0].heading
        startObject.pitch = views[i0].pitch

        stopObject.lng = [views[i1].lng, views[i2].lng, views[i3].lng]
        stopObject.lat = [views[i1].lat, views[i2].lat, views[i3].lat]
        stopObject.alt = [views[i1].alt, views[i2].alt, views[i3].alt]
        stopObject.heading = [views[i1].heading, views[i2].heading, views[i3].heading]
        stopObject.pitch = [views[i1].pitch, views[i2].pitch, views[i3].pitch]

        if (i === m - 1) {
          this._map.scene.screenSpaceCameraController.enableInputs = true
          this._restoreClockState()
          this.fire("finish")
        }
      })

      tweens.push(tween)
    }

    for (let i = 0; i < tweens.length; i++) {
      if (i === tweens.length - 1) {
        tweens[i].chain()
        break
      }

      tweens[i].chain(tweens[i + 1])
    }

    return tweens
  }

  _updateCamera(roamingView) {
    const position = Cesium.Cartesian3.fromDegrees(roamingView.lng, roamingView.lat, roamingView.alt)

    this._map.scene.camera.setView({
      destination: position,
      orientation: {
        heading: Cesium.Math.toRadians(roamingView.heading ?? 0),
        pitch: Cesium.Math.toRadians(roamingView.pitch ?? -90),
        roll: Cesium.Math.toRadians(roamingView.roll ?? 0)
      }
    })
  }

  _map_preUpdateHandler(event) {
    const now = Cesium.JulianDate.toDate(this._map.clock.currentTime).getTime()

    // 调用了 camera.flyTo 时
    if (this._map.scene.camera._currentFlight && this._tweens.length > 0) {
      for (let index = 0; index < this._tweens.length; index++) {
        const tween = this._tweens[index]
        tween.stop()
      }

      this._tweens = []
      return
    }

    // 漫游被暂停时
    if (this._tweens.length === 0 || !this._map.clock.shouldAnimate) {
      return
    }

    // eslint-disable-next-line no-undef
    Tween.update(now)
  }

  _restoreClockState() {
    if (!Cesium.defined(this._map.scene.camera._currentFlight)) {
      this._map.scene.screenSpaceCameraController.enableInputs = true
    }

    if (Cesium.defined(this._oldShouldAnimate)) {
      this._map.clock.shouldAnimate = this._oldShouldAnimate
    }

    if (Cesium.defined(this._oldStartTime)) {
      this._map.clock.startTime = this._oldStartTime
    }

    if (Cesium.defined(this._oldCurrentTime)) {
      this._map.clock.currentTime = this._oldCurrentTime
    }

    if (Cesium.defined(this._oldClockRange)) {
      this._map.clock.clockRange = this._oldClockRange
    }
  }
}

function catmullRom(v, t, alpha = 0.5) {
  let p0
  let p1
  let p2
  let p3

  const type = typeof v
  if (type === "number") {
    // eslint-disable-next-line prefer-rest-params
    p0 = arguments[0]
    // eslint-disable-next-line prefer-rest-params
    p1 = arguments[1]
    // eslint-disable-next-line prefer-rest-params
    p2 = arguments[2]
    // eslint-disable-next-line prefer-rest-params
    p3 = arguments[3]
    // eslint-disable-next-line prefer-rest-params
    t = arguments[4]
    // eslint-disable-next-line prefer-rest-params
    alpha = arguments[5]
  } else if (Object.prototype.toString.call(v) === "[object Array]") {
    p0 = v[0]
    p1 = v[1]
    p2 = v[2]
    p3 = v[3]
  } else {
    throw new Error("参数格式错误")
  }

  let dt0 = Math.pow(Math.abs(p0 - p1), alpha)
  let dt1 = Math.pow(Math.abs(p1 - p2), alpha)
  let dt2 = Math.pow(Math.abs(p2 - p3), alpha)
  if (dt1 < 1e-4) {
    dt1 = 1.0
  }
  if (dt0 < 1e-4) {
    dt0 = dt1
  }
  if (dt2 < 1e-4) {
    dt2 = dt1
  }
  let t0 = (p1 - p0) / dt0 - (p2 - p0) / (dt0 + dt1) + (p2 - p1) / dt1
  let t1 = (p2 - p1) / dt1 - (p3 - p1) / (dt1 + dt2) + (p3 - p2) / dt2
  t0 *= dt1
  t1 *= dt1
  const x0 = p1
  const x1 = p2
  const a0 = x0
  const a1 = t0
  const a2 = -3 * x0 + 3 * x1 - 2 * t0 - t1
  const a3 = 2 * x0 - 2 * x1 + t0 + t1
  const tt = t * t
  const ttt = tt * t
  return a0 + a1 * t + a2 * tt + a3 * ttt
}
