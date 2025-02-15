import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 36.873519, lng: 106.863496, alt: 19999205, heading: 354, pitch: -89 },
    orderIndependentTranslucency: false,
    // showMoon: false,
    // showSkyBox: false,
    // showSkyAtmosphere: false,
    // fog: false,
    // contextOptions: { webgl: { alpha: true } }, // 允许透明，只能Map初始化传入 [关键代码]
    backgroundImage: "https://data.mars3d.cn/img/busines/background1.jpg",
    globe: {
      baseColor: "rgba(0,0,0,0)",
      showGroundAtmosphere: false,
      enableLighting: false
    }
  }
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

export function showImgNone() {
  map.setOptions({
    scene: {
      backgroundType: "image",
      backgroundImage: "none"
    }
  })
}

export function showImg1() {
  map.setOptions({
    scene: {
      backgroundType: "image",
      backgroundImage: "https://data.mars3d.cn/img/busines/background1.jpg"
    }
  })
}

export function showImg2() {
  map.setOptions({
    scene: {
      backgroundType: "image",
      backgroundImage: "https://data.mars3d.cn/img/map/world/world.jpg"
    }
  })
}

export function showImg3() {
  // map.container.style.backgroundImage = "url(//data.mars3d.cn/img/busines/background2.jpg)"
  map.setOptions({
    scene: {
      backgroundType: "image",
      backgroundImage: "https://data.mars3d.cn/img/busines/background2.jpg"
    }
  })
}



export function showColor() {
  map.setOptions({
    scene: {
      backgroundType: "color",
      backgroundColor: " #120f44" // 天空背景色
    }
  })
}

export function showSkybox() {
  map.setOptions({
    scene: {
      backgroundType: "skybox",
      skyBox: {
        sources: {
          negativeX: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_mx.jpg",
          negativeY: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_my.jpg",
          negativeZ: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_mz.jpg",
          positiveX: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_px.jpg",
          positiveY: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_py.jpg",
          positiveZ: "https://data.mars3d.cn/img/skybox/2/tycho2t3_80_pz.jpg"
        }
      }
    }
  })

}
