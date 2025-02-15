import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.control = {
    toolbar: {
      position: "right-top"
    },
    geocoder: { service: "tdt" } // service可以指定使用POI服务
  }
  return option
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  // 查询结果回调方法
  map.control.geocoder._czmContrl.viewModel.complete.addEventListener(function () {
    const arrdata = map.control.geocoder._czmContrl.viewModel.suggestions
    console.log("查询结果", arrdata)
  })
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
