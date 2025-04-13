import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    toolbar: {
      position: "right-top"
    },
    sceneMode: false // 方式1：options中添加控件
  }
  return option
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 方式2：在创建地球后按需调用addControl添加(直接new对应type类型的控件)
  const sceneModePicker = new mars3d.control.SceneModePicker({})
  map.addControl(sceneModePicker)

  // map.control.sceneModePicker.on(mars3d.EventType.click, function (event) {
  //   console.log("您单击了视图切换按钮", event)
  // })

  map.on(mars3d.EventType.morphComplete, function (event) {
    console.log("您切换了视图", event)
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
