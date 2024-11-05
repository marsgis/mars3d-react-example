import * as mars3d from "mars3d"

export let map // mars3d.Map三维地图对象
let tiles3dLayer
let tiles3dLayerOutline

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 31.224168, lng: 121.539945, alt: 1866.8, heading: 298.4, pitch: -27.4 }
  },
  terrain: { show: false }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map
  map.basemap = 2017 // 蓝色底图

  // 泛光效果
  const bloomEffect = new mars3d.effect.BloomEffect({})
  map.addEffect(bloomEffect)

  // 白膜建筑
  tiles3dLayer = new mars3d.layer.TilesetLayer({
    name: "上海市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 1,
    popup: "all",
    customShader: new Cesium.CustomShader({
      uniforms: {
        u_envTexture: {
          value: new Cesium.TextureUniform({
            url: "//data.mars3d.cn/img/textures/buildings-kj.jpg"
          }),
          type: Cesium.UniformType.SAMPLER_2D
        },
        u_build1: {
          type: Cesium.UniformType.SAMPLER_2D,
          value: new Cesium.TextureUniform({
            url: "//data.mars3d.cn/img/textures/buildings-colors.png"
          })
        },
        u_lerp: {
          type: Cesium.UniformType.FLOAT,
          value: -100
        },
        u_lightPosition: {
          type: Cesium.UniformType.VEC3,
          value: Cesium.Cartesian3.fromDegrees(121.488452, 31.263529, 28)
        },
        u_lightColor: {
          type: Cesium.UniformType.VEC3,
          value: Cesium.Color.fromCssColorString("#FF4500")
        },
        u_lightPosition2: {
          type: Cesium.UniformType.VEC3,
          value: Cesium.Cartesian3.fromDegrees(121.449176, 31.247574, 20)
        },
        u_lightColor2: {
          type: Cesium.UniformType.VEC3,
          value: Cesium.Color.fromCssColorString("#6900ff")
        },
        u_lightRadius: {
          type: Cesium.UniformType.FLOAT,
          value: 2000
        },
        u_play: {
          type: Cesium.UniformType.BOOL,
          value: true
        },
        u_lerp2: {
          type: Cesium.UniformType.FLOAT,
          value: 0
        },
        u_color: {
          type: Cesium.UniformType.VEC4,
          value: Cesium.Color.fromCssColorString("#62809b")
        }
      },
      mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
      lightingModel: Cesium.LightingModel.UNLIT,
      fragmentShaderText: `
      #define sat( a ) clamp( a, 0.0, 1.0 )
      float noise_fun(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.45678, 93.970204))) * 4321.12345) * 20.;
      }
      float getDistanceDecay( float lightDistance, float distance,float decay) {
          if ( distance > 0.0 && decay > 0.0 ) {
              return pow( sat( - lightDistance / distance + 1.0 ), decay );
          }
          return 1.0;
      }
      vec3 addPointLight(vec3 lightPosition, vec3 lightColor, vec3 positionWC , vec3 normal){
          float distance = u_lightRadius;
          float decay = 1.0;
          float lightDistance = length( lightPosition - positionWC );
          lightColor *= getDistanceDecay( lightDistance, distance, decay );
          return lightColor;
      }
      void fragmentMain(FragmentInput fsInput,inout czm_modelMaterial material) {
          vec3 positionMC = fsInput.attributes.positionMC;
          vec3 positionEC = fsInput.attributes.positionEC;
          vec3 normalEC = fsInput.attributes.normalEC;
          vec3 posToCamera = normalize(-positionEC);
          vec2 uv = fsInput.attributes.texCoord_0;
          float diffuseCoefficient = max(0.0, dot(normalEC, vec3(0.2)) * 1.0);
          vec4 glColor1 = vec4(0.);
          vec4 glColor2 = vec4(0.);
          {
              float heightInterval = 50.0;
              float lineWidth = 10.0;
              float modResult = mod(positionMC.z, heightInterval);
              vec3 finalColor = vec3(0.3);
              vec4 textureColor3 = texture(u_build1,vec2(fract(uv.s),float(uv.t * 5.0) - (czm_frameNumber/60.)));
              if (modResult < lineWidth / 2.0) {
                  finalColor = textureColor3.rgb * 2.5;
              }
              glColor1.rgb = mix(u_color.rgb * 1.5, finalColor,clamp(positionMC.z / 20., 0.0, 1.0));
              glColor1.rgb *= min(diffuseCoefficient + 0.2, 1.0);
              glColor1.a = 1.0;
          }
          {
              vec3 coord = normalize(vec3(czm_inverseViewRotation * reflect(posToCamera, normalEC)));
              vec4 darkRefColor = texture(u_envTexture, vec2(coord.x, (coord.z - coord.y) / 2.0));
              glColor2.rgb = mix(mix(vec3(.2), vec3(.1,.2,.6),clamp(positionMC.z / 400., 0.0, 1.0)) , darkRefColor.rgb ,0.2);
              glColor2.rgb *= min(diffuseCoefficient + 0.1, 1.0);

              // 基础点光源高亮指定范围
              glColor2.rgb += addPointLight(
                  u_lightPosition ,
                  u_lightColor,
                  (czm_model * vec4(positionMC,1.0)).xyz ,
                  normalEC);
              glColor2.rgb += addPointLight(
                  u_lightPosition2 ,
                  u_lightColor2,
                  (czm_model * vec4(positionMC,1.0)).xyz ,
                  normalEC);

              // cesiumlab 光圈特效
              float _baseHeight = 0.0;
              float _heightRange = 20.0;
              float _glowRange = 300.0;
              float czm_height = positionMC.z - _baseHeight;
              float czm_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
              float czm_a12 = czm_height / _heightRange + sin(czm_a11) * 0.1;
              float times = czm_frameNumber / 60.0;
              glColor2.rgb *= vec3(czm_a12);// 渐变
              float time = fract(czm_frameNumber / 360.0);
              time = abs(time - 0.5) * 2.0;
              float czm_h = clamp(czm_height / _glowRange, 0.0, 1.0);
              float czm_diff = step(0.005, abs(czm_h - time));
              glColor2.rgb += glColor2.rgb * (1.0 - czm_diff);
              glColor2.a = 1.0;
          }

          float noise = noise_fun(vec2(positionMC.x, positionMC.y));
          bool condition1 = positionMC.z > (u_lerp + noise);
          bool condition2 = u_play && u_lerp < 0. && u_lerp2 < positionEC.x && positionEC.x < u_lerp2 + 350.;
          bool condition3 = u_play && u_lerp > 800. && u_lerp2 < positionEC.x && positionEC.x < u_lerp2 + 350.;

          material.diffuse = mix(glColor2.rgb, glColor1.rgb, float(condition1 || condition2 || condition3));
          material.alpha = mix(glColor2.a, glColor1.a, float(condition1 || condition2 || condition3));

      }
           `
    })
  })
  map.addLayer(tiles3dLayer)

  map.on("click", function (e) {
    tiles3dLayer.customShader.uniforms.u_lightPosition.value = e.cartesian
  })

  // 白膜建筑线框渲染
  tiles3dLayerOutline = new mars3d.layer.TilesetLayer({
    name: "上海市建筑物",
    url: "//data.mars3d.cn/3dtiles/jzw-shanghai/tileset.json",
    maximumScreenSpaceError: 1,
    debugWireframe: true,
    enableDebugWireframe: true,
    customShader: new Cesium.CustomShader({
      mode: Cesium.CustomShaderMode.REPLACE_MATERIAL,
      lightingModel: Cesium.LightingModel.UNLIT,
      uniforms: {
        u_lerp: {
          type: Cesium.UniformType.FLOAT,
          value: 0
        },
        u_color: {
          type: Cesium.UniformType.VEC4,
          value: Cesium.Color.fromCssColorString("#62809b")
        },
        u_play: {
          type: Cesium.UniformType.BOOL,
          value: true
        }
      },
      fragmentShaderText: `
    float noise_fun(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.45678, 93.970204))) * 4321.12345) * 20.;
    }
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 positionMC = fsInput.attributes.positionMC;
        vec3 positionEC = fsInput.attributes.positionEC;
        if(u_play && u_lerp <positionEC.x && positionEC.x < u_lerp + 350.) {
            material.diffuse = u_color.rgb;
            material.alpha = 1.;
        }else {
            discard;
        }
    }
    `
    })
  })
  map.addLayer(tiles3dLayerOutline)

  bindEvent()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
}

function bindEvent() {
  const _date = map.clock.currentTime
  const _startTime = Cesium.JulianDate.addSeconds(_date, 10, new Cesium.JulianDate())
  const _stopTime = Cesium.JulianDate.addSeconds(_date, 60, new Cesium.JulianDate())
  const _time1 = Cesium.JulianDate.addSeconds(_date, 1 * 10, new Cesium.JulianDate())
  const _time2 = Cesium.JulianDate.addSeconds(_date, 2 * 10, new Cesium.JulianDate())
  const _time3 = Cesium.JulianDate.addSeconds(_date, 3 * 10, new Cesium.JulianDate())
  const _time4 = Cesium.JulianDate.addSeconds(_date, 4 * 10, new Cesium.JulianDate())
  const _time5 = Cesium.JulianDate.addSeconds(_date, 5 * 10, new Cesium.JulianDate())
  const _time6 = Cesium.JulianDate.addSeconds(_date, 6 * 10, new Cesium.JulianDate())

  const _property = new Cesium.SampledProperty(Cesium.Color)
  _property.addSample(_time1, Cesium.Color.fromCssColorString("#62809b"))
  _property.addSample(_time2, Cesium.Color.fromCssColorString("#87CEFA"))
  _property.addSample(_time3, Cesium.Color.fromCssColorString("#003cff"))
  _property.addSample(_time4, Cesium.Color.fromCssColorString("#F08080"))
  _property.addSample(_time5, Cesium.Color.fromCssColorString("#FFA500"))
  _property.addSample(_time6, Cesium.Color.fromCssColorString("#FF4500"))
  map.clock.startTime = _startTime
  map.clock.stopTime = _stopTime
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP

  let step = 20
  let step2 = 1
  map.on(mars3d.EventType.postUpdate, function (event) {
    // 动态线框扫描
    if (tiles3dLayerOutline.customShader.uniforms.u_lerp.value < -5000) {
      step = 20
    } else if (tiles3dLayerOutline.customShader.uniforms.u_lerp.value > 5000) {
      step = -20
    }
    tiles3dLayer.customShader.uniforms.u_lerp2.value += step
    tiles3dLayerOutline.customShader.uniforms.u_lerp.value += step

    // 切换外观
    if (isPlay) {
      if (tiles3dLayer.customShader.uniforms.u_lerp.value < -300) {
        step2 = 1
      } else if (tiles3dLayer.customShader.uniforms.u_lerp.value > 1000) {
        step2 = -1
      }
    }

    tiles3dLayer.customShader.uniforms.u_lerp.value += step2

    // 颜色主题
    const clr = _property.getValue(event.frameState.time)
    if (clr) {
      tiles3dLayer.customShader.uniforms.u_color.value = clr
      tiles3dLayerOutline.customShader.uniforms.u_color.value = clr
    }
  })
}

let isPlay
export function changePlay(value) {
  isPlay = value
}

export function changeOutline(value) {
  tiles3dLayer.customShader.uniforms.u_play.value = value
  tiles3dLayerOutline.customShader.uniforms.u_play.value = value
}

export function changeHeight(value) {
  tiles3dLayer.customShader.uniforms.u_lerp.value = value
}
