import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  control: {
    mouseDownView: {
      rightDrag: true
    }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.scene.screenSpaceCameraController.minimumCollisionTerrainHeight = 150000

  // 限定pitch角度： max ，min(默认-90)
  // map.setPitchRange(-10)
  map.scene.screenSpaceCameraController.maximumTiltAngle = Cesium.Math.toRadians(90)


  // 设置鼠标操作习惯,更换中键和右键
  map.changeMouseModel(true)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function shadingMaterials(val) {
  if (val === 1) {
    // 设置鼠标操作习惯,更换中键和右键
    map.changeMouseModel(true)
  } else {
    map.changeMouseModel(false)
  }
}

// 解除ALT按键的操作
// const getInputAction_old = Cesium.ScreenSpaceEventHandler.prototype.getInputAction
// Cesium.ScreenSpaceEventHandler.prototype.getInputAction = function (type, modifier) {
//   if (modifier === Cesium.KeyboardEventModifier.ALT) {
//     modifier = undefined
//   }
//   return getInputAction_old.bind(this)(type, modifier)
// }
