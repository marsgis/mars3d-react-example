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
      positiveX: "//data.mars3d.cn/img/skybox-near/qingtian/rightav9.jpg",
      negativeX: "//data.mars3d.cn/img/skybox-near/qingtian/leftav9.jpg",
      positiveY: "//data.mars3d.cn/img/skybox-near/qingtian/frontav9.jpg",
      negativeY: "//data.mars3d.cn/img/skybox-near/qingtian/backav9.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox-near/qingtian/topav9.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox-near/qingtian/bottomav9.jpg"
    },
    sources2: {
      positiveX: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetRight.png",
      negativeX: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetLeft.png",
      positiveY: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetFront.png",
      negativeY: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetBack.png",
      positiveZ: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetUp.png",
      negativeZ: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetDown.png"
    },
    sources3: {
      negativeX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_pz.jpg"
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
