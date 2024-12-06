import * as mars3d from "mars3d"

function initMap() {
  // 添加控件有2种方式:

  const map = new mars3d.Map("mars3dContainer", {
    scene: {
      center: { lat: 30.827414, lng: 116.378229, alt: 16933, heading: 360, pitch: -56 }
    },
    terrain: { url: "//data.mars3d.cn/terrain", show: true },
    basemaps: [
      {
        name: "天地图影像",
        icon: "//data.mars3d.cn/img/thumbnail/basemap/tdt_img.png",
        type: "group",
        layers: [
          { name: "底图", type: "tdt", layer: "img_d" },
          { name: "注记", type: "tdt", layer: "img_z" }
        ],
        show: true
      }
    ],
    thing: {
      terrainClip: {
        diffHeight: 50,
        image: "//data.mars3d.cn/img/textures/poly-stone.jpg",
        imageBottom: "//data.mars3d.cn/img/textures/poly-soil.jpg",
        splitNum: 100,
        area: [
          {
            exact: true,
            diffHeight: 900,
            positions: [
              [116.334222, 30.899171, 645.5],
              [116.370874, 30.899171, 645.5],
              [116.370874, 30.944509, 645.5],
              [116.334222, 30.944509, 645.5]
            ]
          },
          {
            exact: true,
            diffHeight: 200,
            positions: [
              [116.416497, 30.934256, 775.9],
              [116.427392, 30.962941, 1084.9],
              [116.434838, 30.932608, 900.4],
              [116.462994, 30.923081, 771.4],
              [116.437571, 30.916044, 906.4],
              [116.44977, 30.894487, 776.1],
              [116.424183, 30.908752, 727],
              [116.402218, 30.898406, 593.1],
              [116.414309, 30.918806, 588.8],
              [116.387022, 30.933539, 700.6]
            ]
          }
        ]
      }
    }
  })

  // 方式2：在创建地球后按需调用addThing添加
  // const rotatePoint = new mars3d.thing.RotatePoint({
  //   direction: false, // 方向 true逆时针，false顺时针
  //   time: 50 // 给定飞行一周所需时间(单位 秒)，控制速度
  // })
  // map.addThing(rotatePoint)

  setTimeout(() => {
    console.log("地图上已有thing对象", map.thing)
  }, 1000)
}
