import { MarsCollapse, MarsButton, MarsPannel, MarsCheckbox, MarsInput, MarsGui, MarsTree, MarsDialog, MarsSwitch } from "@mars/components/MarsUI"
import { Space } from "antd"
import * as mapWork from "./map.js"
import { useState, useRef, useMemo, useCallback } from "react"
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
  const marsGuiRef3 = useRef<any>()
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
      extra(data) {
        return (
          <MarsCheckbox
            onChange={(e) => {
              mapWork.updateDepthTest(e.target.checked)
            }}
          >
            深度检测
          </MarsCheckbox>
        )
      },
      change(value) {
        marsGuiRef.current.updateField("txtZ", value)
        updataValue()
      }
    }
  ]
  const options2: GuiItem[] = [
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
        marsGuiRef2.current.updateField("axis", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationX",
      label: "绕X轴旋转模型",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef2.current.updateField("rotationX", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationY",
      label: "绕Y轴旋转模型",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef2.current.updateField("rotationY", value)
        updataValue()
      }
    },
    {
      type: "number",
      field: "rotationZ",
      label: "绕Z轴旋转模型",
      step: 0.1,
      value: 0.0,
      change(value) {
        marsGuiRef2.current.updateField("rotationZ", value)
        updataValue()
      }
    }
  ]
  // 其他参数
  const options3: GuiItem[] = [
    {
      type: "number",
      field: "scale",
      label: "缩放比例",
      step: 0.1,
      value: 1.0,
      change(value) {
        marsGuiRef3.current.updateField("scale", value)
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
        marsGuiRef3.current.updateField("maximumScreenSpaceError", value)
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
        marsGuiRef3.current.updateField("opacity", value)
        updataValue()
      }
    }
  ]

  const [inputUrl, setInputUrl] = useState("//data.mars3d.cn/3dtiles/max-fsdzm/tileset.json")
  const [agent, setAgent] = useState(false)
  const [highlightEnable, setHighlightEnable] = useState(false)
  const [popupEnable, setPopupEnable] = useState(true)

  const [treeData, setTree] = useState<any[]>()
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点
  const [cancelTree, setCancelTree] = useState(false)

  const updataValue = useCallback(() => {
      const data = marsGuiRef.current.getValues()
      const data2 = marsGuiRef2.current.getValues()
      const data3 = marsGuiRef3.current.getValues()

      const data4 = { 
        maximumScreenSpaceError: data3.maximumScreenSpaceError, // 【重要】数据加大，能让最终成像变模糊
        position: {
          lng: data.txtX,
          lat: data.txtY,
          alt: data.txtZ
        },
        rotation: {
          z: data2.rotationZ,
          x: data2.rotationX,
          y: data2.rotationY
        },
        scale: data3.scale,
        depthTestAgainstTerrain: data.depthTestAgainstTerrain,
        axis: data2.axis ? data2.axis : undefined, // 变换垂直轴
        proxy: agent ? "//server.mars3d.cn/proxy/" : undefined, // 代理
        opacity: data3.opacity,
        highlight: highlightEnable
          ? {
            type: "click",
            outlineEffect: true,
            color: "#00FF00"
          }
          : false,
        popup: popupEnable ? "all" : false,
        show: true
      }

      mapWork.setLayerOptions(data4)
      return data4
    },
    [agent, inputUrl, popupEnable, highlightEnable]
  )

  const checkedChange = useCallback((keys: any, item: any) => {
    setCheckedKeys(keys)
    mapWork.compModelChange(item.node.id, item.node.sphere)
  }, [])

  useMemo(() => {
    mapWork.eventTarget.on("tiles3dLayerLoad", function (event: any) {
      const json = event.layer
      // 取模型中心点信息
      const locParams = json.position // 取模型中心点信息
      if (locParams.alt < -1000 || locParams.alt > 10000) {
        locParams.alt = 0 // 高度异常数据，自动赋值高度为0
      }

      marsGuiRef.current.updateField("txtX", locParams.lng.toFixed(6))
      marsGuiRef.current.updateField("txtY", locParams.lat.toFixed(6))
      marsGuiRef.current.updateField("txtZ", locParams.alt.toFixed(6))

      marsGuiRef2.current.updateField("maximumScreenSpaceError", json.maximumScreenSpaceError ?? 16)

      if (json.transform) {
        marsGuiRef2.current.updateField("rotationX", json.rotation.x ?? 0)
        marsGuiRef2.current.updateField("rotationY", json.rotation.y ?? 0)
        marsGuiRef2.current.updateField("rotationZ", json.rotation.z ?? 0)
        marsGuiRef2.current.updateField("axis", json.axis ?? "")

        marsGuiRef3.current.updateField("scale", json.scale ?? 1)
      } else {
        mapWork.updateHeightForSurfaceTerrain(locParams)
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

    // 根据改变的位置触发不同的事件
    mapWork.eventTarget.on("changePoition", function (event: any) {
      marsGuiRef.current.updateField("txtX", event.center.lng)
      marsGuiRef.current.updateField("txtY", event.center.lat)
      marsGuiRef.current.updateField("txtZ", event.center.alt)

      marsGuiRef2.current.updateField("rotationX", event.rotation.x)
      marsGuiRef2.current.updateField("rotationY", event.rotation.y)
      marsGuiRef2.current.updateField("rotationZ", event.rotation.z)
    })

    mapWork.eventTarget.on("changeHeight", function (event: any) {
      marsGuiRef.current.updateField("txtZ", event.alt)
    })
    mapWork.eventTarget.on("historyUrl", function (event: any) {
      if (event.url) {
        setInputUrl(event.url)
      }
      mapWork.showModel(event.url ?? inputUrl)
    })
  }, [])

  return (
    <>
      <MarsPannel visible={true} right="10" top="5" width={400}>
        <MarsCollapse
          collapsible={"header"}
          defaultActiveKey={["1", "2", "3", "4"]}
          items={[
            {
              key: "1",
              label: "模型URL地址",
              extra: (
                <MarsButton
                  onClick={() => {
                    setCancelTree(true)
                    mapWork.showCompTree(inputUrl)
                  }}
                >
                  查看构件
                </MarsButton>
              ),
              children: (
                <Space wrap>
                  <span className="mars-pannel-item-label">模型URL:</span>
                  <MarsInput
                    style={{ width: "280px" }}
                    defaultValue={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value + "")
                    }}
                  ></MarsInput>

                  <MarsButton
                    onClick={() => {
                      mapWork.showModel(inputUrl)

                      marsGuiRef3.current.updateField("opacity", 1)
                      setHighlightEnable(false)
                      setPopupEnable(true)
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
              )
            },
            {
              key: "2",
              label: "模型位置",
              extra: (
                <MarsButton
                  onClick={() => {
                    mapWork.locate()
                  }}
                >
                  定位至模型
                </MarsButton>
              ),
              children: <MarsGui options={options} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef}></MarsGui>
            },
            {
              key: "3",
              label: "模型方向",
              children: <MarsGui options={options2} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef2}></MarsGui>
            },
            {
              key: "4",
              label: "其他参数",
              children: (
                <>
                  <MarsGui options={options3} formProps={{ labelCol: { span: 7 } }} ref={marsGuiRef3}></MarsGui>
                  <Space>
                    <span>单击高亮构件:</span>
                    <MarsSwitch
                      checked={highlightEnable}
                      onChange={(data) => {
                        setHighlightEnable(data)
                        updataValue()
                      }}
                    ></MarsSwitch>

                    <span>单击popup弹窗:</span>
                    <MarsSwitch
                      checked={popupEnable}
                      onChange={(data) => {
                        setPopupEnable(data)
                        updataValue()
                      }}
                    ></MarsSwitch>
                  </Space>

                  <div className="f-tac f-pdg-10-t">
                    <MarsButton
                      onClick={() => {
                        mapWork.saveBookmark()
                      }}
                    >
                      保存参数
                    </MarsButton>
                  </div>
                </>
              )
            }
          ]}
        ></MarsCollapse>
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
