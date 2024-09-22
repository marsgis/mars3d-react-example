import * as mars3d from "mars3d"

export const mapOptions = {
  scene: {
    center: { lat: 30.309522, lng: 116.275765, alt: 69659, heading: 0, pitch: -45 }
  }
  // layers: [
  //   {
  //     type: "3dtiles",
  //     name: "测试模型",
  //     url: "//data.mars3d.cn/3dtiles/bim-daxue/tileset.json",
  //     position: { lng: 117.251229, lat: 31.844015, alt: 31.2 },
  //     maximumScreenSpaceError: 16,
  //     flyTo: true,
  //     flyToOptions: { duration: 0 },
  //     center: { lat: 31.842516, lng: 117.25107, alt: 145, heading: 8, pitch: -39 },
  //     show: true
  //   }
  // ]
}


export let map // mars3d.Map三维地图对象


/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  startAnimation()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function startAnimation() {
  map.flyHome({ duration: 0 })

  // 开场动画
  map.openFlyAnimation({
    // duration1:4,
    // easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
  }).then(() => {
    // 动画播放完成后回调
  })
}

export function stopAnimation() {
  map.camera.cancelFlight()
}
