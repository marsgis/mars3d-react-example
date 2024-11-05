import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    cameraController: {
      maximumZoomDistance: 50000000
    },
    skyBox: {
      sources: {
        negativeX: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_mx.jpg",
        negativeY: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_my.jpg",
        negativeZ: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_mz.jpg",
        positiveX: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_px.jpg",
        positiveY: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_py.jpg",
        positiveZ: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_pz.jpg"
      }
    }
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
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function show1() {
  // 修改天空盒
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/1/tycho2t3_80_pz.jpg"
    }
  })
}

export function show2() {
  // 修改天空盒
  // map.scene.skyBox = new Cesium.SkyBox({
  //   sources: {
  //     negativeX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mx.jpg",
  //     negativeY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_my.jpg",
  //     negativeZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mz.jpg",
  //     positiveX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_px.jpg",
  //     positiveY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_py.jpg",
  //     positiveZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_pz.jpg"
  //   }
  // })

  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: {
        sources: {
          negativeX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mx.jpg",
          negativeY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_my.jpg",
          negativeZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_mz.jpg",
          positiveX: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_px.jpg",
          positiveY: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_py.jpg",
          positiveZ: "//data.mars3d.cn/img/skybox/2/tycho2t3_80_pz.jpg"
        }
      }
    }
  })
}

export function show3() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/3/tycho2t3_80_pz.jpg"
    }
  })
}

export function show4() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/4/tycho2t3_80_pz.jpg"
    }
  })
}

export function show5() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/5/tycho2t3_80_pz.jpg"
    }
  })
}

export function show6() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_mx.jpg",
      negativeY: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_my.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_mz.jpg",
      positiveX: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_px.jpg",
      positiveY: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_py.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox/6/tycho2t3_80_pz.jpg"
    }
  })
}
