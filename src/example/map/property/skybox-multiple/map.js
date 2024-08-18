import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.85579, lng: 117.160245, alt: 273.4, heading: 153.6, pitch: -1.5 },
    showSkyAtmosphere: false // 需要关闭
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.scene.skyAtmosphere.show = false

  map.scene.skyBox = new mars3d.MultipleSkyBox({
    sources: {
      positiveX: "img/skybox_near/qingtian/rightav9.jpg",
      negativeX: "img/skybox_near/qingtian/leftav9.jpg",
      positiveY: "img/skybox_near/qingtian/frontav9.jpg",
      negativeY: "img/skybox_near/qingtian/backav9.jpg",
      positiveZ: "img/skybox_near/qingtian/topav9.jpg",
      negativeZ: "img/skybox_near/qingtian/bottomav9.jpg"
    },
    sources2: {
      positiveX: "img/skybox_near/wanxia/SunSetRight.png",
      negativeX: "img/skybox_near/wanxia/SunSetLeft.png",
      positiveY: "img/skybox_near/wanxia/SunSetFront.png",
      negativeY: "img/skybox_near/wanxia/SunSetBack.png",
      positiveZ: "img/skybox_near/wanxia/SunSetUp.png",
      negativeZ: "img/skybox_near/wanxia/SunSetDown.png"
    },
    sources3: {
      negativeX: "img/skybox/2/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/2/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/2/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/2/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/2/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/2/tycho2t3_80_pz.jpg"
    }
  })
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 更新场景参数
export function onChangeSceneVal(u_sceneSwitch) {
  // @ts-ignore
  map.scene.skyBox.select = u_sceneSwitch
}
