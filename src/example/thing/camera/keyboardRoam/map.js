import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中
let keyboardRoam

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.840726, lng: 117.25174, alt: 206, heading: 357, pitch: -25 },
    cameraController: {
      enableCollisionDetection: false
    }
  },
  // thing: {
  //   keyboardRoam: {
  //     enabled: true
  //   }
  // },
  layers: [
    {
      id: 1987,
      name: "教学楼",
      type: "3dtiles",
      url: "https://data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
      position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
      maximumScreenSpaceError: 16,
      maxMemory: 1024,
      enableCollision: true,
      show: true
    }
  ]
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  keyboardRoam = new mars3d.thing.KeyboardRoam({
    moveStep: 10, // 平移步长 (米)。
    dirStep: 25, // 相机原地旋转步长，值越大步长越小。
    rotateStep: 1.0, // 相机围绕目标点旋转速率，0.3-2.0
    minPitch: -89, // 最小仰角
    maxPitch: 0, // 最大仰角
    minHeight: 80
  })
  map.addThing(keyboardRoam)

  keyboardRoam.on(mars3d.EventType.keydown, function(event) {
    eventTarget.fire(event.type, event)
  })
  keyboardRoam.on(mars3d.EventType.keyup, function(event) {
    eventTarget.fire(event.type, event)
  })

  // 不按键一直自动往前走，调用stopMoveForward停止。
  // keyboardRoam.startMoveForward()

  // 相机原地左一直旋转
  // setInterval(function () {
  //   keyboardRoam.rotateCamera(mars3d.MoveType.LEFT_ROTATE)
  // }, 100)

  // // 模拟键盘按键操作，按下事件
  // keyboardRoam._onKeyDown({ keyCode: 38 })

  // // 模拟键盘按键操作，释放事件
  // keyboardRoam._onKeyUp({ keyCode: 38 })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

// 修改步长
export function changeSlider(val) {
  if (val) {
    keyboardRoam.moveStep = val
  }
}

// 室内
export function centerAtDX1() {
  keyboardRoam.moveStep = 0.1 // 平移步长 (米)。
  keyboardRoam.dirStep = 50 // 相机原地旋转步长，值越大步长越小。
  keyboardRoam.rotateStep = 0.3 // 相机围绕目标点旋转速率，0.3-2.0

  map.setCameraView({ lat: 31.843804, lng: 117.250994, alt: 33, heading: 307, pitch: 1 })
}

// 室外
export function centerAtDX2() {
  keyboardRoam.moveStep = 10 // 平移步长 (米)。
  keyboardRoam.dirStep = 25 // 相机原地旋转步长，值越大步长越小。
  keyboardRoam.rotateStep = 1.0 // 相机围绕目标点旋转速率，0.3-2.0

  map.setCameraView({ lat: 31.829732, lng: 117.246797, alt: 773, heading: 357, pitch: -25 })
}
