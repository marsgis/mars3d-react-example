import * as mars3d from "mars3d"

function initMap() {
  // 添加控件有2种方式:

  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 31.789209, lng: 117.214049, alt: 603, heading: 10, pitch: -11 }
    },
    // 方式1：在创建地球前的传参中配置effect参数
    effect: {
      rain: {
        speed: 10,
        size: 20,
        direction: 10
      }
    },
    basemaps: [
      {
        name: "单张图片",
        icon: "//data.mars3d.cn/img/thumbnail/basemap/offline.png",
        type: "image",
        url: "//data.mars3d.cn/img/map/world/world.jpg",
        show: true
      }
    ]
  })

  // 方式2：在创建地球后按需调用addEffect添加
  //  const rainEffect = new mars3d.effect.RainEffect({
  //     speed: 10,
  //     size: 20,
  //     direction: 10
  //   })
  //   map.addEffect(rainEffect)

  console.log("地图上已有场景效果", map.effect)
}
