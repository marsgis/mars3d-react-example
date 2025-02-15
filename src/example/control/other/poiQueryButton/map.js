import * as mars3d from "mars3d"
import { PoiQueryButton } from "./PoiQueryButton"

export let map // mars3d.Map三维地图对象

export const mapOptions = {
  scene: {
    center: { lat: 31.805875, lng: 117.237115, alt: 11874, heading: 1, pitch: -69 }
  },
  control: {
    geocoder: false
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  const poiQueryButton = new PoiQueryButton({
    insertIndex: 0 // 插入的位置顺序
  })
  map.addControl(poiQueryButton)
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}
