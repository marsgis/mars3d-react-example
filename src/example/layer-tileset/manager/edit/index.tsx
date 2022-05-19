import {
  MarsCollapse,
  MarsCollapsePanel,
  MarsButton,
  MarsPannel,
  MarsCheckbox,
  MarsInput,
  MarsGui,
  MarsTree,
  MarsDialog
} from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import type { GuiItem } from "@mars/components/MarsUI"

function isHaveChildren(arr: any, index: number) {
  if (!arr.children) {
    return
  }

  const childerens = arr.children
  const childeren: any[] = []
  childerens.forEach((item: any, i: number) => {
    i++
    const childOne = isHaveChildren(item, i)

    childeren.push({
      title: item.name,
      key: index + "-" + i,
      id: item.eleid,
      sphere: item.sphere,
      children: childOne
    })
    return childeren
  })
  return childeren
}

function UIComponent() {
  const marsGuiRef = useRef<any>()
  const marsGuiRef2 = useRef<any>()
  const options: GuiItem[] = [
    {
      type: "number",
      field: "txtX",
      label: "经度",
      step: 0.000001,
      value: 0,
      change(value) {
        marsGuiRef.current.updateField("txtX", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "txtY",
      label: "纬度",
      step: 0.000001,
      value: 0,
      change(value) {
        marsGuiRef.current.updateField("txtY", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "txtZ",
      label: "高度",
      value: 0,
      change(value) {
        marsGuiRef.current.updateField("txtZ", value)
        updataValue()
      }
    },
    {
      type: "switch",
      field: "depthTestAgainstTerrain",
      label: "深度检测",
      value: false,
      change(value) {
        marsGuiRef.current.updateField("depthTestAgainstTerrain", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationX",
      label: "方向X",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef.current.updateField("rotationX", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationY",
      label: "方向Y",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef.current.updateField("rotationY", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationZ",
      label: "方向Z(四周)",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef.current.updateField("rotationZ", value)
        updataValue()
      }
    },
    {
      type: "select",
      field: "axis",
      label: "变换垂直轴",
      value: "",
      options: [
        { value: "", label: "默认" },
        { value: "Z_UP_TO_X_UP", label: "Z轴 -> X轴" },
        { value: "Z_UP_TO_Y_UP", label: "Z轴 -->Y轴" },
        { value: "X_UP_TO_Y_UP", label: "X轴 -->Y轴" },
        { value: "X_UP_TO_Z_UP", label: "X轴 -->Z轴" },
        { value: "Y_UP_TO_X_UP", label: "Y轴 -->X轴" },
        { value: "Y_UP_TO_Z_UP", label: "Y轴 -->Z轴" }
      ],
      change(value) {
        marsGuiRef.current.updateField("axis", value)
        updataValue()
      }
    },
    {
      type: "switch",
      field: "tilesEditorEnabled",
      label: "鼠标拖拽编辑",
      value: false,
      change(value) {
        marsGuiRef.current.updateField("tilesEditorEnabled", value)
        updataValue()
      }
    }
  ]
  const options2: GuiItem[] = [
    {
      type: "number",
      field: "scale",
      label: "缩放比例",
      step: 0.1,
      value: true,
      change(value) {
        marsGuiRef.current.updateField("scale", value)
        updataValue()
      }
    },
    {
      type: "slider",
      field: "maximumScreenSpaceError",
      label: "显示精度",
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      change(value) {
        marsGuiRef.current.updateField("maximumScreenSpaceError", value)
        updataValue()
      }
    },
    {
      type: "slider",
      field: "luminanceAtZenith",
      label: "材质底色",
      value: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      change(value) {
        marsGuiRef.current.updateField("luminanceAtZenith", value)
        updataValue()
      }
    },
    {
      type: "slider",
      field: "opacity",
      label: "透明度",
      value: 1,
      min: 0.1,
      max: 1,
      step: 0.1,
      change(value) {
        marsGuiRef.current.updateField("opacity", value)
        updataValue()
      }
    }
  ]

  const [inputUrl, setInputUrl] = useState("//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json")
  const [agent, setAgent] = useState(false)

  const [treeData, setTree] = useState<any[]>()
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点
  const [cancelTree, setCancelTree] = useState(false)

  const updataValue = useCallback(() => {
    const data = marsGuiRef.current.getValues()
    const data2 = marsGuiRef2.current.getValues()
    const data3 = {
      txtModel: inputUrl,
      chkProxy: agent,
      txtX: data.txtX,
      txtY: data.txtY,
      txtZ: data.txtZ,
      depthTestAgainstTerrain: data.depthTestAgainstTerrain,
      rotationZ: data.rotationZ,
      rotationX: data.rotationX,
      rotationY: data.rotationY,
      scale: data2.scale,
      axis: data.axis,
      tilesEditorEnabled: data.tilesEditorEnabled,
      maximumScreenSpaceError: data2.maximumScreenSpaceError,
      luminanceAtZenith: data2.luminanceAtZenith,
      opacity: data2.opacity
    }
    mapWork.updateModel(data3)
    return data3
  }, [agent, inputUrl])

  useEffect(() => {
    setTimeout(() => {
      mapWork.showModel(inputUrl)
    }, 1000)
  }, [inputUrl])

  const checkedChange = useCallback((keys: any, item: any) => {
    setCheckedKeys(keys)
    mapWork.compModelChange(item.node.id, item.node.sphere)
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("tiles3dLayerLoad", function (event: any) {
      const tileset = event.data
      const tiles3dLayer = event.tiles3dLayer

      // 取模型中心点信息
      const locParams = tiles3dLayer.center

      if (locParams.alt < -1000 || locParams.alt > 10000) {
        locParams.alt = 0 // 高度异常数据，自动赋值高度为0
      }
      marsGuiRef.current.updateField("txtX", locParams.lng.toFixed(6))
      marsGuiRef.current.updateField("txtY", locParams.lat.toFixed(6))
      marsGuiRef.current.updateField("txtZ", locParams.alt.toFixed(6))

      marsGuiRef2.current.updateField("luminanceAtZenith", tileset.luminanceAtZenith)
      marsGuiRef2.current.updateField("maximumScreenSpaceError", tileset.maximumScreenSpaceError)

      if (tiles3dLayer.transform) {
        marsGuiRef.current.updateField("rotationX", tiles3dLayer.rotation_x.toFixed(1))
        marsGuiRef.current.updateField("rotationY", tiles3dLayer.rotation_y.toFixed(1))
        marsGuiRef.current.updateField("rotationZ", tiles3dLayer.rotation_z.toFixed(1))

        marsGuiRef2.current.updateField("scale", tiles3dLayer.scale || 1)
        marsGuiRef2.current.updateField("axis", tiles3dLayer.axis)
      }
    })

    mapWork.eventTarget.on("compTree", function (event: any) {
      const data = event.data
      const expandedKeys = []
      data.forEach((item: any, index: number) => {
        const childeren = isHaveChildren(item, index)

        setTree([
          {
            title: item.name,
            key: index,
            id: item.eleid,
            sphere: item.sphere,
            children: childeren
          }
        ])
        expandedKeys.push(index)
      })
      setExpandedKeys(expandedKeys)
    })

    mapWork.eventTarget.on("tilesEditor", function (event: any) {
      mapWork.editor(event.data, marsGuiRef.current.getValue("txtZ"))
    })

    // 根据改变的位置触发不同的事件
    mapWork.eventTarget.on("changePoition", function (event: any) {
      marsGuiRef.current.updateField("txtX", event.point.lng)
      marsGuiRef.current.updateField("txtY", event.point.lat)
      marsGuiRef.current.updateField("txtZ", event.point.alt)
    })

    mapWork.eventTarget.on("changeHeading", function (event: any) {
      marsGuiRef.current.updateField("rotationZ", event.tiles3dLayer.rotation_z)
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} right="10" top="10" width={400}>
        <MarsCollapse defaultActiveKey={["1", "2", "3"]}>
          <MarsCollapsePanel key="1" header="模型URL地址">
            <Space wrap>
              <span className="mars-pannel-item-label">模型URL地址:</span>
              <MarsInput
                style={{ width: "280px" }}
                defaultValue={inputUrl}
                onChange={(e) => {
                  setInputUrl(e + "")
                }}
              ></MarsInput>

              <MarsButton
                onClick={() => {
                  mapWork.showModel(inputUrl)
                }}
              >
                加载模型
              </MarsButton>
              <MarsCheckbox
                onChange={(e) => {
                  setAgent(e.target.checked)
                }}
              >
                使用代理
              </MarsCheckbox>
            </Space>
          </MarsCollapsePanel>
          <MarsCollapsePanel key="2" header="位置方向">
            <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef}></MarsGui>
          </MarsCollapsePanel>
          <MarsCollapsePanel key="3" header="其他参数">
            <MarsGui options={options2} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef2}></MarsGui>
            <Space>
              <MarsButton
                onClick={() => {
                  mapWork.locate()
                }}
              >
                视角定位至模型
              </MarsButton>
              <MarsButton
                onClick={() => {
                  setCancelTree(true)
                  mapWork.showCompTree(inputUrl)
                }}
              >
                查看构件
              </MarsButton>
              <MarsButton
                onClick={() => {
                  mapWork.saveBookmark(updataValue())
                }}
              >
                保存参数
              </MarsButton>
            </Space>
          </MarsCollapsePanel>
        </MarsCollapse>
      </MarsPannel>
      <MarsDialog
        onClose={() => {
          setCancelTree(false)
        }}
        visible={cancelTree}
        title="查看控件"
        left="60"
        top="10"
        bottom={40}
        maxHeight={800}
      >
        <MarsButton
          onClick={() => {
            mapWork.checkedTree()
            setCheckedKeys([])
          }}
        >
          取消选中
        </MarsButton>
        <MarsTree
          treeData={treeData}
          onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={checkedChange}
        ></MarsTree>
      </MarsDialog>
    </>
  )
}

export default UIComponent
