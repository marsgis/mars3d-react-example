import { MarsColor, MarsPannel, MarsRadio, MarsRadioGroup, MarsSelect, MarsSlider, MarsTable } from "@mars/components/MarsUI"
import * as mapWork from "./map.js"
import "./index.less"
const dataSource = [
  {
    key: "1",
    name: "场景Scene",
    describe: "场景模式",
    operation: "select",
    options: [
      {
        value: 3, // Cesium.SceneMode.SCENE3D
        label: "三维视图"
      },
      {
        value: 2, // Cesium.SceneMode.SCENE2D
        label: "二维视图"
      },
      {
        value: 1, // Cesium.SceneMode.COLUMBUS_VIEW
        label: "哥伦布视图"
      }
    ],
    value: 3
  },
  {
    key: "2",
    name: "场景Scene",
    describe: "高动态渲染",
    operation: "checked",
    value: "2",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("highDynamicRange", true)
      } else {
        mapWork.setSceneOptions("highDynamicRange", false)
      }
    }
  },
  {
    key: "3",
    name: "场景Scene",
    describe: "快速抗锯齿",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("fxaa", true)
      } else {
        mapWork.setSceneOptions("fxaa", false)
      }
    }
  },
  {
    key: "4",
    name: "场景Scene",
    describe: "显示太阳",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("showSun", true)
      } else {
        mapWork.setSceneOptions("showSun", false)
      }
    }
  },
  {
    key: "5",
    name: "场景Scene",
    describe: "显示月亮",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("showMoon", true)
      } else {
        mapWork.setSceneOptions("showMoon", false)
      }
    }
  },
  {
    key: "6",
    name: "场景Scene",
    describe: "显示天空盒子",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("showSkyBox", true)
      } else {
        mapWork.setSceneOptions("showSkyBox", false)
      }
    }
  },
  {
    key: "7",
    name: "场景Scene",
    describe: "空间背景色",
    operation: "color",
    value: "#000000",
    change(baseColor: string) {
      mapWork.setSceneOptions("backgroundColor", baseColor)
    }
  },
  {
    key: "8",
    name: "场景Scene",
    describe: "大气外光圈",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("showSkyAtmosphere", true)
      } else {
        mapWork.setSceneOptions("showSkyAtmosphere", false)
      }
    }
  },
  {
    key: "9",
    name: "场景Scene",
    describe: "雾化效果",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneOptions("fog", true)
      } else {
        mapWork.setSceneOptions("fog", false)
      }
    }
  },
  {
    key: "10",
    name: "地球Globe",
    describe: "地形夸张倍数",
    operation: "range",
    value: 1,
    min: 1,
    max: 80,
    step: 1,
    change(multiple: number) {
      mapWork.setSceneGlobeOptions("terrainExaggeration", multiple)
    }
  },
  {
    key: "11",
    name: "地球Globe",
    describe: "昼夜区域",
    operation: "checked",
    value: "2",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneGlobeOptions("enableLighting", true)
      } else {
        mapWork.setSceneGlobeOptions("enableLighting", false)
      }
    }
  },
  {
    key: "12",
    name: "地球Globe",
    describe: "绘制地面大气",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneGlobeOptions("showGroundAtmosphere", true)
      } else {
        mapWork.setSceneGlobeOptions("showGroundAtmosphere", false)
      }
    }
  },
  {
    key: "13",
    name: "地球Globe",
    describe: "深度监测",
    operation: "checked",
    value: "2",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneGlobeOptions("depthTestAgainstTerrain", true)
      } else {
        mapWork.setSceneGlobeOptions("depthTestAgainstTerrain", false)
      }
    }
  },
  {
    key: "14",
    name: "地球Globe",
    describe: "显示底图",
    operation: "checked",
    value: "1",
    change(index: string) {
      mapWork.showBaseMap(index)
    }
  },
  {
    key: "15",
    name: "地球Globe",
    describe: "地球背景色",
    operation: "color",
    value: "#000000",
    change(baseColor: string) {
      mapWork.setSceneGlobeOptions("baseColor", baseColor)
    }
  },
  {
    key: "16",
    name: "鼠标交互",
    describe: "缩放地图",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("enableZoom", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableZoom", false)
      }
    }
  },
  {
    key: "17",
    name: "鼠标交互",
    describe: "倾斜相机",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("enableTilt", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableTilt", false)
      }
    }
  },
  {
    key: "18",
    name: "鼠标交互",
    describe: "旋转转换位置",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("enableRotate", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableRotate", false)
      }
    }
  },
  {
    key: "19",
    name: "鼠标交互",
    describe: "平移地图",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("enableTranslate", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableTranslate", false)
      }
    }
  },
  {
    key: "20",
    name: "鼠标交互",
    describe: "南北极绕轴心旋转",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("constrainedAxis", true)
      } else {
        mapWork.setSceneCameraControllerOptions("constrainedAxis", false)
      }
    }
  },
  {
    key: "21",
    name: "鼠标交互",
    describe: "是否进入地下",
    operation: "checked",
    value: "1",
    change(index: string) {
      if (index === "1") {
        mapWork.setSceneCameraControllerOptions("enableCollisionDetection", true)
      } else {
        mapWork.setSceneCameraControllerOptions("enableCollisionDetection", false)
      }
    }
  },
  {
    key: "22",
    name: "鼠标交互",
    describe: "最小碰撞高度",
    operation: "range",
    value: 15000,
    min: 100,
    max: 500000,
    step: 100,
    change(terrainHeight: number) {
      mapWork.setSceneCameraControllerOptions("minimumCollisionTerrainHeight", terrainHeight)
    }
  },
  {
    key: "23",
    name: "鼠标交互",
    describe: "相机最近视距",
    operation: "range",
    value: 1,
    min: 1,
    max: 10000,
    step: 1,
    change(distance: number) {
      mapWork.setSceneCameraControllerOptions("minimumZoomDistance", distance)
    }
  },
  {
    key: "24",
    name: "鼠标交互",
    describe: "相机最远视距",
    operation: "range",
    value: 50000000,
    min: 10000,
    max: 90000000,
    step: 1000,
    change(distance: number) {
      mapWork.setSceneCameraControllerOptions("maximumZoomDistance", distance)
    }
  },
  {
    key: "25",
    name: "鼠标交互",
    describe: "滚轮放大倍数",
    operation: "range",
    value: 3,
    min: 1,
    max: 10,
    step: 1,
    change(zoomFactor: number) {
      mapWork.setSceneCameraControllerOptions("zoomFactor", zoomFactor)
    }
  }
]

function UIComponent() {
  const columns = [
    {
      title: "类型",
      dataIndex: "name",
      width: 80,
      onCell: (record: any, index: any) => {
        const obj = {} as any
        if (index === 0) {
          obj.rowSpan = 9
        } else {
          obj.rowSpan = 0
        }
        if (index === 9) {
          obj.rowSpan = 7
        }
        if (index === 16) {
          obj.rowSpan = 12
        }
        return obj
      },
      render: (comp: string, value: any, index: number) => {
        return (
          <a href="https://mars3d.cn/api/Map.html#.sceneOptions" target="_black">
            {comp}
          </a>
        )
      }
    },
    {
      title: "场景描述",
      dataIndex: "describe"
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (comp: string, { value, change, min, options, max, step }: any, index: number) => {
        if (comp === "select") {
          return (
            <MarsSelect
              style={{ width: 120 }}
              defaultValue={value}
              options={options}
              onChange={(value: string) => mapWork.sceneMode(value)}
            ></MarsSelect>
          )
        }

        if (comp === "checked") {
          return (
            <MarsRadioGroup
              onChange={(e: any) => {
                change(e.target.value)
              }}
              defaultValue={value}
            >
              <MarsRadio value="1">是</MarsRadio>
              <MarsRadio value="2">否</MarsRadio>
            </MarsRadioGroup>
          )
        }

        if (comp === "color") {
          return <MarsColor onChange={(e: any) => change(e)}></MarsColor>
        }

        if (comp === "range") {
          return <MarsSlider min={min} max={max} step={step} defaultValue={value} onChange={(e: any) => change(e)}></MarsSlider>
        }
      }
    }
  ]

  return (
    <MarsPannel visible={true} top={10} right={10} bottom={40} width={360}>
      <MarsTable dataSource={dataSource} columns={columns} bordered pagination={false}></MarsTable>
    </MarsPannel>
  )
}

export default UIComponent
