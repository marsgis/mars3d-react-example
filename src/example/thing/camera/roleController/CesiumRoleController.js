
/**
 * CesiumRoleController 由 刘博方 开发
 */
class CesiumRoleController extends mars3d.thing.BaseThing {
  constructor(options = {}) {
    super(options)

    this.hpRoll = new Cesium.HeadingPitchRoll(0, 0, 0)

    this.speed = 1
    this.speedVector = new Cesium.Cartesian3()
    this.hpRange = new Cesium.HeadingPitchRange()
    this.converter = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west")

    this.event = false
    this.radian = Cesium.Math.toRadians(1)
    this.flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    }
    this.keydownFlag = false
  }

  //= ========= 对外属性 ==========
  /**
   * 位置坐标 （笛卡尔坐标）, 赋值时可以传入LatLngPoint对象
   * @type {Cesium.Cartesian3}
   */
  get position() {
    return this._position
  }

  set position(value) {
    this._position = mars3d.LngLatPoint.toCartesian(value)

    this.options.speed ? (this.speed = this.options.speed) : (this.speed = 1)

    this.event = true
    const winPosition = Cesium.SceneTransforms.worldToWindowCoordinates(this._map.scene, this._position)
    const ray = this._map.camera.getPickRay(winPosition)
    const cartesian_terrain = this._map.scene.globe.pick(ray, this._map.scene)
    const cartesian_3dtiles = this._map.scene.pickPosition(winPosition)

    if (cartesian_terrain) {
      this.cartographic_terrain = Cesium.Cartographic.fromCartesian(cartesian_terrain)
    }
    if (cartesian_3dtiles) {
      this.cartographic_3dtiles = Cesium.Cartographic.fromCartesian(cartesian_3dtiles)
    }

    if (this.cartographic_3dtiles && this.cartographic_3dtiles.height > 0) {
      this._map.scene.clampToHeightMostDetailed([this._position]).then((newP) => {
        if (Cesium.Cartographic.fromCartesian(newP[0]).height > 0) {
          this._position = newP[0]
          this.addModel(this._position)
        }
      })
    } else if (this.cartographic_terrain) {
      if (this.cartographic_terrain.height > 0) {
        Cesium.sampleTerrainMostDetailed(this._map.terrainProvider, [
          this._map.scene.globe.ellipsoid.cartesianToCartographic(this._position)
        ]).then(async (newP) => {
          this._position = this._map.scene.globe.ellipsoid.cartographicToCartesian(newP[0])
          this.addModel(this._position)
        })
      } else {
        this.addModel(this._position)
      }
    } else {
      this.addModel(this._position)
    }
  }
  //= ========= 方法 ==========

  /**
   * 对象添加到地图前创建一些对象的钩子方法，
   * 只会调用一次
   * @return {void}  无
   * @private
   */
  _mountedHook() {
    this._graphicLayer = new mars3d.layer.GraphicLayer({ private: true })
  }

  /**
   * 对象添加到地图上的创建钩子方法，
   * 每次add时都会调用
   * @return {void}  无
   * @private
   */
  _addedHook() {
    this._map.addLayer(this._graphicLayer)

    this._bindEvent()
  }

  /**
   * 对象从地图上移除的创建钩子方法，
   * 每次remove时都会调用
   * @return {void}  无
   * @private
   */
  _removedHook() {
    this._graphicLayer.clear()
    this._map.removeLayer(this._graphicLayer)

    this.event = false
    this._map.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
    this._map.scene.primitives.remove(this._primitive)
    this.reset()

    this._unbindEvent()
  }

  _keydownHandler(e) {
    if (this.event) {
      this.setFlagStatus(e, true)
    }
  }

  _keyupHandler(e) {
    if (this.event) {
      this.setFlagStatus(e, false)
    }
  }

  _clockTickHandler(e) {
    if (this.event) {
      if (this.flag.moveUp) {
        if (this.flag.moveLeft) {
          this.hpRoll.heading -= this.radian
        }

        if (this.flag.moveRight) {
          this.hpRoll.heading += this.radian
        }
        this.move(true)
      }

      if (this.flag.moveDown) {
        if (this.flag.moveLeft) {
          this.hpRoll.heading -= this.radian
        }

        if (this.flag.moveRight) {
          this.hpRoll.heading += this.radian
        }
        this.move(false)
      }

      if (this.flag.moveLeft && !this.flag.moveDown && !this.flag.moveUp && !this.flag.moveRight) {
        this.hpRoll.heading -= this.radian
        Cesium.Transforms.headingPitchRollToFixedFrame(
          this._position,
          this.hpRoll,
          Cesium.Ellipsoid.WGS84,
          this.converter,
          this._primitive.modelMatrix
        )
      }

      if (this.flag.moveRight && !this.flag.moveDown && !this.flag.moveUp && !this.flag.moveLeft) {
        this.hpRoll.heading += this.radian
        Cesium.Transforms.headingPitchRollToFixedFrame(
          this._position,
          this.hpRoll,
          Cesium.Ellipsoid.WGS84,
          this.converter,
          this._primitive.modelMatrix
        )
      }
    }
  }

  _preUpdateHandler() {
    if (this.event) {
      if (this._primitive && this.boundingSphere) {
        if (this.keydownFlag) {
          this.zoomToModel()
        }
      }
    }
  }

  // 绑定事件
  _bindEvent() {
    this._map.on(mars3d.EventType.keydown, this._keydownHandler, this)
    this._map.on(mars3d.EventType.keyup, this._keyupHandler, this)

    this._map.on(mars3d.EventType.clockTick, this._clockTickHandler, this)
    this._map.on(mars3d.EventType.preUpdate, this._preUpdateHandler, this)
  }

  _unbindEvent() {
    this._map.off(mars3d.EventType.keydown, this._keydownHandler, this)
    this._map.off(mars3d.EventType.keyup, this._keyupHandler, this)

    this._map.off(mars3d.EventType.clockTick, this._clockTickHandler, this)
    this._map.off(mars3d.EventType.preUpdate, this._preUpdateHandler, this)
  }

  async addModel(position) {
    const model = await Cesium.Model.fromGltfAsync({
      url: this.options.url,
      modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, this.hpRoll, Cesium.Ellipsoid.WGS84, this.converter),
      minimumPixelSize: 128
    })
    this._primitive = this._map.scene.primitives.add(model)

    this._primitive.readyEvent.addEventListener(() => {
      if (this.options.animation) {
        this._primitive.activeAnimations.add({
          name: this.options.animation,
          loop: Cesium.ModelAnimationLoop.REPEAT
        })

      }

      this._map.clock.shouldAnimate = false
      this.boundingSphere = this._primitive.boundingSphere
      this.zoomToModel(this.options)
    })
  }

  setFlagStatus(key, value) {
    if (this._primitive) {
      switch (key.keyCode) {
        case 65:
          this.flag.moveLeft = value
          break
        case 87:
          this.validateKey(value)
          this.flag.moveUp = value
          break
        case 68:
          this.flag.moveRight = value
          break
        case 83:
          this.validateKey(value)
          this.flag.moveDown = value
          break
      }
    }
  }

  validateKey(value) {
    this._map.clock.shouldAnimate = value
    this.keydownFlag = value
  }

  zoomToModel() {
    const r = 2.0 * Math.max(this.boundingSphere.radius, this._map.camera.frustum.near)
    let pitch = 0
    let lockViewLevel = 0
    let range = 0
    this.options.pitch ? (pitch = this.options.pitch) : (pitch = -25)
    this.options.lockViewLevel ? (lockViewLevel = this.options.lockViewLevel) : (lockViewLevel = 3)
    this.options.range ? (range = this.options.range) : (range = 4.0)
    switch (lockViewLevel) {
      case 1:
        this.hpRange.heading = this._map.camera.heading
        this.hpRange.pitch = this._map.camera.pitch
        break
      case 2:
        this.hpRange.heading = this.hpRoll.heading - Cesium.Math.toRadians(90)
        this.hpRange.pitch = this._map.camera.pitch
        break
      default:
        this.hpRange.heading = this.hpRoll.heading - Cesium.Math.toRadians(90)
        this.hpRange.pitch = Cesium.Math.toRadians(pitch)
        break
    }
    this.hpRange.range = r * range
    this._map.camera.lookAt(this.boundingSphere.center, this.hpRange)
  }

  move(isUP) {
    if (isUP > 0) {
      this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_Y, this.speed, this.speedVector)
    } else {
      this.speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_Y, -this.speed, this.speedVector)
    }
    this._position = Cesium.Matrix4.multiplyByPoint(this._primitive.modelMatrix, this.speedVector, this._position)

    if (this.cartographic_3dtiles && this.cartographic_3dtiles.height > 0) {
      this._map.scene.clampToHeightMostDetailed([this._position]).then((newP) => {
        if (Cesium.Cartographic.fromCartesian(newP[0]).height > 0) {
          this._position = newP[0]
          Cesium.Transforms.headingPitchRollToFixedFrame(
            this._position,
            this.hpRoll,
            Cesium.Ellipsoid.WGS84,
            this.converter,
            this._primitive.modelMatrix
          )
        }
      })
    } else if (this.cartographic_terrain) {
      if (this.cartographic_terrain.height > 0) {
        Cesium.sampleTerrainMostDetailed(this._map.terrainProvider, [
          this._map.scene.globe.ellipsoid.cartesianToCartographic(this._position)
        ]).then((newP) => {
          this._position = this._map.scene.globe.ellipsoid.cartographicToCartesian(newP[0])
          Cesium.Transforms.headingPitchRollToFixedFrame(
            this._position,
            this.hpRoll,
            Cesium.Ellipsoid.WGS84,
            this.converter,
            this._primitive.modelMatrix
          )
        })
      } else {
        const Cartographic = this._map.scene.globe.ellipsoid.cartesianToCartographic(this._position)
        Cartographic.height = 0
        this._position = this._map.scene.globe.ellipsoid.cartographicToCartesian(Cartographic)
        Cesium.Transforms.headingPitchRollToFixedFrame(
          this._position,
          this.hpRoll,
          Cesium.Ellipsoid.WGS84,
          this.converter,
          this._primitive.modelMatrix
        )
      }
    } else {
      const Cartographic = this._map.scene.globe.ellipsoid.cartesianToCartographic(this._position)
      Cartographic.height = 0
      this._position = this._map.scene.globe.ellipsoid.cartographicToCartesian(Cartographic)
      Cesium.Transforms.headingPitchRollToFixedFrame(
        this._position,
        this.hpRoll,
        Cesium.Ellipsoid.WGS84,
        this.converter,
        this._primitive.modelMatrix
      )
    }
  }

  reset() {
    this.hpRoll = new Cesium.HeadingPitchRoll(0, 0, 0)

    this.speed = 1
    this._primitive = null
    this.boundingSphere = null
    this.speedVector = new Cesium.Cartesian3()
    this.hpRange = new Cesium.HeadingPitchRange()
    this.converter = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west")
    this.cartographic_terrain = null
    this.cartographic_3dtiles = null
    this.event = false
    this.radian = Cesium.Math.toRadians(1)
    this.flag = {
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    }
    this.options = null
    this.keydownFlag = false
  }
}
