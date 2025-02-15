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
        positiveX: "https://data.mars3d.cn/img/skybox-near/qingtian/rightav9.jpg",
        negativeX: "https://data.mars3d.cn/img/skybox-near/qingtian/leftav9.jpg",
        positiveY: "https://data.mars3d.cn/img/skybox-near/qingtian/frontav9.jpg",
        negativeY: "https://data.mars3d.cn/img/skybox-near/qingtian/backav9.jpg",
        positiveZ: "https://data.mars3d.cn/img/skybox-near/qingtian/topav9.jpg",
        negativeZ: "https://data.mars3d.cn/img/skybox-near/qingtian/bottomav9.jpg"
      }
    }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  // map.scene.skyAtmosphere.show = false
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function sunny() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "https://data.mars3d.cn/img/skybox-near/qingtian/rightav9.jpg",
      negativeX: "https://data.mars3d.cn/img/skybox-near/qingtian/leftav9.jpg",
      positiveY: "https://data.mars3d.cn/img/skybox-near/qingtian/frontav9.jpg",
      negativeY: "https://data.mars3d.cn/img/skybox-near/qingtian/backav9.jpg",
      positiveZ: "https://data.mars3d.cn/img/skybox-near/qingtian/topav9.jpg",
      negativeZ: "https://data.mars3d.cn/img/skybox-near/qingtian/bottomav9.jpg"
    }
  })
}

export function sunsetGlow() {
  map.scene.skyBox = new mars3d.GroundSkyBox({
    sources: {
      positiveX: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetRight.png",
      negativeX: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetLeft.png",
      positiveY: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetFront.png",
      negativeY: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetBack.png",
      positiveZ: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetUp.png",
      negativeZ: "https://data.mars3d.cn/img/skybox-near/wanxia/SunSetDown.png"
    }
  })
}

export function blueSky() {
  // map.scene.skyBox = new mars3d.GroundSkyBox({
  //   sources: {
  //     positiveX: "https://data.mars3d.cn/img/skybox-near/lantian/Right.jpg",
  //     negativeX: "https://data.mars3d.cn/img/skybox-near/lantian/Left.jpg",
  //     positiveY: "https://data.mars3d.cn/img/skybox-near/lantian/Front.jpg",
  //     negativeY: "https://data.mars3d.cn/img/skybox-near/lantian/Back.jpg",
  //     positiveZ: "https://data.mars3d.cn/img/skybox-near/lantian/Up.jpg",
  //     negativeZ: "https://data.mars3d.cn/img/skybox-near/lantian/Down.jpg"
  //   }
  // })

  // 修改方式二，map.setOptions方法
  map.setOptions({
    scene: {
      skyBox: {
        type: "ground",
        sources: {
          positiveX: "https://data.mars3d.cn/img/skybox-near/lantian/Right.jpg",
          negativeX: "https://data.mars3d.cn/img/skybox-near/lantian/Left.jpg",
          positiveY: "https://data.mars3d.cn/img/skybox-near/lantian/Front.jpg",
          negativeY: "https://data.mars3d.cn/img/skybox-near/lantian/Back.jpg",
          positiveZ: "https://data.mars3d.cn/img/skybox-near/lantian/Up.jpg",
          negativeZ: "https://data.mars3d.cn/img/skybox-near/lantian/Down.jpg"
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
