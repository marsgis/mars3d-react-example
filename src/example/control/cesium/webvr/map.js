import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = function (option) {
  option.scene.center = { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 }
  option.control = {
    toolbar: {
      position: "right-top"
    },
    vrButton: true // 方式1：options中添加控件
  }
  return option
}

// 初始化地图业务，生命周期钩子函数（必须）,框架在地图初始化完成后自动调用该函数
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  map.control.vrButton.on(mars3d.EventType.click, function (event) {
    const isVR = map.scene.useWebVR
    console.log("点击了VR按钮", isVR)
  })

  globalNotify("已知问题提示", `(1) 请确保您的显示器调整到 3D模式。(2) 需要佩戴3D眼镜才能体验效果。`)

  // 加个模型，效果更NB
  const tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "县城社区",
    url: "https://data.mars3d.cn/3dtiles/qx-shequ/tileset.json",
    position: { alt: 148.2 },
    maximumScreenSpaceError: 1,
    cullWithChildrenBounds: false,
    skipLevelOfDetail: true,
    preferLeaves: true,
    center: { lat: 28.439577, lng: 119.476925, alt: 229, heading: 57, pitch: -29 }
  })
  map.addLayer(tiles3dLayer)

  openWebVR()
}

// 释放当前地图业务的生命周期函数,具体项目中时必须写onMounted的反向操作（如解绑事件、对象销毁、变量置空）
export function onUnmounted() {
  map = null
}

function openWebVR() {
  // WebVR相关参数: 眼镜的视角距离（单位：米）
  map.scene.eyeSeparation = 100.0
  // map.scene.eyeSeparation = -100

  // WebVR相关参数: 焦距
  map.scene.eyeSeparation.focalLength = 5.0

  // 这句话打开VR
  map.scene.useWebVR = true

  // 自定义的水平交错片段着色器代码
  const postProcessStage = new Cesium.PostProcessStage({
    fragmentShader: `
        uniform sampler2D colorTexture;
        in vec2 v_textureCoordinates;

        uniform float width;
        // uniform float height;

        void main() {
          vec4 color;
          float x = v_textureCoordinates.x;
          if (mod(v_textureCoordinates.x * width, 2.0) < 0.5) {
            color = texture(colorTexture, vec2(v_textureCoordinates.x / 2.0, v_textureCoordinates.y / 2.0));
          } else {
            color = texture(colorTexture, vec2(v_textureCoordinates.x / 2.0 + 0.5, v_textureCoordinates.y / 2.0));
          }
          out_FragColor = color;
        }
      `,
    uniforms: {
      width: map.scene.canvas.clientWidth
      // height: map.scene.canvas.clientHeight
    }
  })
  // map.scene.postProcessStages.add(postProcessStage)
}
