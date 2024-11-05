import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

let tiles3dLayer
export let graphicLayer // 矢量图层对象

export const mapOptions = {
  scene: {
    center: { lat: 31.247568, lng: 121.450197, alt: 2441, heading: 104.7, pitch: -28.6 }
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

  map.viewer.shadows = true
  map.viewer.shadowMap.size = 2048
  map.viewer.shadowMap.softShadows = false
  map.viewer.shadowMap.maximumDistance = 4000

  map.scene.globe.enableLighting = true
  map.scene.fog.minimumBrightness = 0.5
  map.scene.fog.density = 2.0e-4 * 1.2
  map.scene.globe.atmosphereLightIntensity = 20
  map.scene.globe.atmosphereBrightnessShift = -0.01

  map.scene.postProcessStages.bloom.enabled = true
  map.scene.postProcessStages.bloom.uniforms.contrast = 119
  map.scene.postProcessStages.bloom.uniforms.brightness = -0.4
  map.scene.postProcessStages.bloom.uniforms.glowOnly = false
  map.scene.postProcessStages.bloom.uniforms.delta = 0.9
  map.scene.postProcessStages.bloom.uniforms.sigma = 3.78
  map.scene.postProcessStages.bloom.uniforms.stepSize = 5
  map.scene.postProcessStages.bloom.uniforms.isSelected = false

  map.scene.postProcessStages.ambientOcclusion.enabled = false
  map.scene.postProcessStages.ambientOcclusion.uniforms.intensity = 1.5
  map.scene.postProcessStages.ambientOcclusion.uniforms.bias = 0.4
  map.scene.postProcessStages.ambientOcclusion.uniforms.lengthCap = 0.45
  map.scene.postProcessStages.ambientOcclusion.uniforms.stepSize = 1.8
  map.scene.postProcessStages.ambientOcclusion.uniforms.blurStepSize = 1.0

  setEnabled(true)

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  tiles3dLayer = new mars3d.layer.OsmBuildingsLayer({
    customShader: new Cesium.CustomShader({
      uniforms: {
        u_envTexture: {
          value: new Cesium.TextureUniform({
            url: "//data.mars3d.cn/img/textures/sky.jpg"
          }),
          type: Cesium.UniformType.SAMPLER_2D
        },
        u_envTexture2: {
          value: new Cesium.TextureUniform({
            url: "//data.mars3d.cn/img/textures/buildings-kj.jpg"
          }),
          type: Cesium.UniformType.SAMPLER_2D
        },
        u_isDark: {
          value: true,
          type: Cesium.UniformType.BOOL
        }
      },
      mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
      lightingModel: Cesium.LightingModel.UNLIT,
      fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
              vec3 positionMC = fsInput.attributes.positionMC;
              vec3 positionEC = fsInput.attributes.positionEC;
              vec3 normalEC = fsInput.attributes.normalEC;
              vec3 posToCamera = normalize(-positionEC);
              vec3 coord = normalize(vec3(czm_inverseViewRotation * reflect(posToCamera, normalEC)));
              float ambientCoefficient = 0.3;
              float diffuseCoefficient = max(0.0, dot(normalEC, czm_sunDirectionEC) * 1.0);
              if(u_isDark){
                  // dark
                  vec4 darkRefColor = texture(u_envTexture2, vec2(coord.x, (coord.z - coord.y) / 2.0));
                  material.diffuse = mix(mix(vec3(0.3), vec3(0.1,0.2,0.4),clamp(positionMC.z / 200., 0.0, 1.0)) , darkRefColor.rgb ,0.3);
                  material.diffuse *= 0.2;
                  // 注意shader中写浮点数是 一定要带小数点 否则会报错 比如0需要写成0.0 1要写成1.0
                  float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                  float _heightRange = 20.0; // 高亮的范围(_baseHeight ~ _baseHeight + _heightRange)
                  float _glowRange = 300.0; // 光环的移动范围(高度)
                  // 建筑基础色
                  float czm_height = positionMC.z - _baseHeight;
                  float czm_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                  float czm_a12 = czm_height / _heightRange + sin(czm_a11) * 0.1;

                  float times = czm_frameNumber / 60.0;
                  material.diffuse *= vec3(czm_a12);// 渐变
                  // 动态光环
                  float time = fract(czm_frameNumber / 360.0);
                  time = abs(time - 0.5) * 2.0;
                  float czm_h = clamp(czm_height / _glowRange, 0.0, 1.0);
                  float czm_diff = step(0.005, abs(czm_h - time));
                  material.diffuse += material.diffuse * (1.0 - czm_diff);
              } else {
                  // day
                  vec4 dayRefColor = texture(u_envTexture, vec2(coord.x, (coord.z - coord.y) / 3.0));
                  material.diffuse = mix(mix(vec3(0.000), vec3(0.5),clamp(positionMC.z / 300., 0.0, 1.0)) , dayRefColor.rgb ,0.3);
                  material.diffuse *= min(diffuseCoefficient + ambientCoefficient, 1.0);
              }
              material.alpha = 1.0;
          } `
    }),
    popup: "all"
  })
  map.addLayer(tiles3dLayer)

  addExGltfModel()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

// 4座高亮的大厦gltf模型的加载
function addExGltfModel() {
  const L00 = new Cesium.Cartesian3(1.234709620475769, 1.221461296081543, 1.273156881332397)
  const L1_1 = new Cesium.Cartesian3(1.135921120643616, 1.171217799186707, 1.287644743919373)
  const L10 = new Cesium.Cartesian3(1.245193719863892, 1.245591878890991, 1.282818794250488)
  const L11 = new Cesium.Cartesian3(-1.106930732727051, -1.112522482872009, -1.153198838233948)
  const L2_2 = new Cesium.Cartesian3(-1.086226940155029, -1.079731941223145, -1.101912498474121)
  const L2_1 = new Cesium.Cartesian3(1.189834713935852, 1.185906887054443, 1.214385271072388)
  const L20 = new Cesium.Cartesian3(0.01778045296669, 0.02013735473156, 0.025313569232821)
  const L21 = new Cesium.Cartesian3(-1.086826920509338, -1.084611177444458, -1.111204028129578)
  const L22 = new Cesium.Cartesian3(-0.05241484940052, -0.048303380608559, -0.041960217058659)
  const coefficients = [L00, L1_1, L10, L11, L2_2, L2_1, L20, L21, L22]

  const imageBasedLighting = new Cesium.ImageBasedLighting({
    specularEnvironmentMaps: "//data.mars3d.cn/img/textures/ibl.ktx2",
    sphericalHarmonicCoefficients: coefficients
  })

  const graphic1 = new mars3d.graphic.ModelPrimitive({
    name: "东方明珠塔",
    popup: "东方明珠塔",
    modelMatrix: generateModelMatrix([121.49697607088487, 31.241891679352257, 10], [0, 0, 0], [0.15, 0.15, 0.126]),
    style: {
      url: "//data.mars3d.cn/gltf/mars/shanghai/dongfangmingzhu/scene.gltf",
      imageBasedLighting: imageBasedLighting,
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_texture: {
            value: new Cesium.TextureUniform({
              url: "//data.mars3d.cn/img/textures/buildings-colors2.png"
            }),
            type: Cesium.UniformType.SAMPLER_2D
          },
          u_isDark: {
            value: true,
            type: Cesium.UniformType.BOOL
          }
        },
        lightingModel: Cesium.LightingModel.PBR,
        fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
              if(u_isDark){
                  vec2 texCoord = fsInput.attributes.texCoord_0 * 0.5;
                  float times = czm_frameNumber / 30.0;
                  vec4 textureColor = texture(u_texture,vec2(fract(texCoord.s),float(texCoord.t) - times));
                  material.diffuse += textureColor.rgb * 0.8;
              }
          }`
      })
    }
  })
  graphicLayer.addGraphic(graphic1)

  const graphic2 = new mars3d.graphic.ModelPrimitive({
    name: "环球金融中心",
    popup: "环球金融中心",
    modelMatrix: generateModelMatrix([121.50306517515779, 31.236594411927722, 0], [0, 0, 0], [3, 3, 4.4]),
    style: {
      url: "//data.mars3d.cn/gltf/mars/shanghai/huanqiujingrong/scene.gltf",
      imageBasedLighting: imageBasedLighting,
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_texture: {
            value: new Cesium.TextureUniform({
              url: "//data.mars3d.cn/img/textures/buildings-kj.jpg"
            }),
            type: Cesium.UniformType.SAMPLER_2D
          },
          u_isDark: {
            value: true,
            type: Cesium.UniformType.BOOL
          }
        },
        lightingModel: Cesium.LightingModel.PBR,
        fragmentShaderText: `
            void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
                if(u_isDark){
                    vec2 texCoord = fsInput.attributes.texCoord_0 * 0.3;
                    float times = czm_frameNumber / 120.0;
                    vec4 textureColor = texture(u_texture,vec2(fract(texCoord.s),float(texCoord.t) - times));
                    material.diffuse += textureColor.rgb * 1.5;
                }
            }  `
      })
    }
  })
  graphicLayer.addGraphic(graphic2)

  const graphic3 = new mars3d.graphic.ModelPrimitive({
    name: "上海中心大厦",
    popup: "上海中心大厦",
    modelMatrix: generateModelMatrix([121.50140479453857, 31.237266571858395, 0], [0, 0, 0], [2.5, 2.5, 3.0]),
    style: {
      url: "//data.mars3d.cn/gltf/mars/shanghai/shanghaizhongxin/scene.gltf",
      imageBasedLighting: imageBasedLighting,
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_texture: {
            value: new Cesium.TextureUniform({
              url: "//data.mars3d.cn/img/textures/buildings-colors.png"
            }),
            type: Cesium.UniformType.SAMPLER_2D
          },
          u_isDark: {
            value: true,
            type: Cesium.UniformType.BOOL
          }
        },
        lightingModel: Cesium.LightingModel.PBR,
        fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
              if(u_isDark){
                  vec2 texCoord = fsInput.attributes.texCoord_0 * 0.5;
                  float times = czm_frameNumber / 120.0;
                  vec4 textureColor = texture(u_texture,vec2(float(texCoord.s) - times),fract(texCoord.t));
                  material.diffuse += textureColor.rgb * 1.5;
              }
          }   `
      })
    }
  })
  graphicLayer.addGraphic(graphic3)

  const graphic4 = new mars3d.graphic.ModelPrimitive({
    name: "金茂大厦",
    popup: "金茂大厦",
    modelMatrix: generateModelMatrix([121.49805570610201, 31.23266477688614, 400], [0, 0, 45], [3, 3, 2.5]),
    style: {
      url: "//data.mars3d.cn/gltf/mars/shanghai/jinmaodasha/scene.gltf",
      imageBasedLighting: imageBasedLighting,
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_texture: {
            value: new Cesium.TextureUniform({
              url: "//data.mars3d.cn/img/textures/buildings-colors2.png"
            }),
            type: Cesium.UniformType.SAMPLER_2D
          },
          u_isDark: {
            value: true,
            type: Cesium.UniformType.BOOL
          }
        },
        lightingModel: Cesium.LightingModel.PBR,
        fragmentShaderText: `
          void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
              if(u_isDark){
                  vec2 texCoord = fsInput.attributes.texCoord_0 * 0.3;
                  float times = czm_frameNumber / 120.0;
                  vec4 textureColor = texture(u_texture,vec2(fract(texCoord.s),float(texCoord.t) - times));
                  material.diffuse += textureColor.rgb * 0.8;
              }
          }  `
      })
    }
  })
  graphicLayer.addGraphic(graphic4)
}

// 生成矩阵
const generateModelMatrix = (position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) => {
  const rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rotation[0])))
  const rotationY = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(rotation[1])))
  const rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rotation[2])))
  if (!(position instanceof Cesium.Cartesian3)) {
    position = Cesium.Cartesian3.fromDegrees(...position)
  }
  const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  Cesium.Matrix4.multiply(enuMatrix, rotationX, enuMatrix)
  Cesium.Matrix4.multiply(enuMatrix, rotationY, enuMatrix)
  Cesium.Matrix4.multiply(enuMatrix, rotationZ, enuMatrix)
  const scaleMatrix = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(...scale))
  const modelMatrix = Cesium.Matrix4.multiply(enuMatrix, scaleMatrix, new Cesium.Matrix4())

  return modelMatrix
}

export function setEnabled(value) {
  map.basemap.brightness = value ? 0.5 : 1

  map.scene.postProcessStages.bloom.enabled = value
  map.scene.postProcessStages.ambientOcclusion.enabled = !value

  if (tiles3dLayer) {
    tiles3dLayer.customShader.uniforms.u_isDark.value = value
  }

  if (graphicLayer) {
    graphicLayer.eachGraphic((graphic) => {
      if (graphic.primitive?.customShader) {
        graphic.primitive.customShader.uniforms.u_isDark.value = value
      }
    })
  }
}
