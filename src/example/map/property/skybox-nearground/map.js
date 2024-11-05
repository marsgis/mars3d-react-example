import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.830035, lng: 117.159801, alt: 409, heading: 41, pitch: 0 },
    showSkyAtmosphere: false, // 需要关闭
    skyBox: {
      type: "ground",
      sources: {
        positiveX: "//data.mars3d.cn/img/skybox-near/qingtian/rightav9.jpg",
        negativeX: "//data.mars3d.cn/img/skybox-near/qingtian/leftav9.jpg",
        positiveY: "//data.mars3d.cn/img/skybox-near/qingtian/frontav9.jpg",
        negativeY: "//data.mars3d.cn/img/skybox-near/qingtian/backav9.jpg",
        positiveZ: "//data.mars3d.cn/img/skybox-near/qingtian/topav9.jpg",
        negativeZ: "//data.mars3d.cn/img/skybox-near/qingtian/bottomav9.jpg"
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
  // map.scene.skyAtmosphere.show = false
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

export function sunny() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "//data.mars3d.cn/img/skybox-near/qingtian/rightav9.jpg",
      negativeX: "//data.mars3d.cn/img/skybox-near/qingtian/leftav9.jpg",
      positiveY: "//data.mars3d.cn/img/skybox-near/qingtian/frontav9.jpg",
      negativeY: "//data.mars3d.cn/img/skybox-near/qingtian/backav9.jpg",
      positiveZ: "//data.mars3d.cn/img/skybox-near/qingtian/topav9.jpg",
      negativeZ: "//data.mars3d.cn/img/skybox-near/qingtian/bottomav9.jpg"
    }
  })
}

export function sunsetGlow() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetRight.png",
      negativeX: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetLeft.png",
      positiveY: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetFront.png",
      negativeY: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetBack.png",
      positiveZ: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetUp.png",
      negativeZ: "//data.mars3d.cn/img/skybox-near/wanxia/SunSetDown.png"
    }
  })
}

export function blueSky() {
  // map.scene.skyBox = new mars3d.GroundSkyBox({
  //   sources: {
  //     positiveX: "//data.mars3d.cn/img/skybox-near/lantian/Right.jpg",
  //     negativeX: "//data.mars3d.cn/img/skybox-near/lantian/Left.jpg",
  //     positiveY: "//data.mars3d.cn/img/skybox-near/lantian/Front.jpg",
  //     negativeY: "//data.mars3d.cn/img/skybox-near/lantian/Back.jpg",
  //     positiveZ: "//data.mars3d.cn/img/skybox-near/lantian/Up.jpg",
  //     negativeZ: "//data.mars3d.cn/img/skybox-near/lantian/Down.jpg"
  //   }
  // })

  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: {
        type: "ground",
        sources: {
          positiveX: "//data.mars3d.cn/img/skybox-near/lantian/Right.jpg",
          negativeX: "//data.mars3d.cn/img/skybox-near/lantian/Left.jpg",
          positiveY: "//data.mars3d.cn/img/skybox-near/lantian/Front.jpg",
          negativeY: "//data.mars3d.cn/img/skybox-near/lantian/Back.jpg",
          positiveZ: "//data.mars3d.cn/img/skybox-near/lantian/Up.jpg",
          negativeZ: "//data.mars3d.cn/img/skybox-near/lantian/Down.jpg"
        }
      }
    }
  })
}

export function defaultSky() {
  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: { type: "default" }
    }
  })
}
