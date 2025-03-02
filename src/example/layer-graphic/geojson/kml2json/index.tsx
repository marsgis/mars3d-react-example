import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import "./index.less"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"

function UIComponent() {
  const [treeData, setTree] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点

  useMemo(() => {
    mapWork.treeEvent.on("refTree", function () {
      // 重置上一次的树状数据
      const showIds = [] // 是显示状态的图层id集合
      const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）
      const result = mapWork.getGraphicsTree({
        forEach: function (item) {
          item.key = item.id // 树控件api需要的唯一标识
          item.title = item.name || "未命名" // 树控件api需要的显示文本字段

          if (item.show) {
            showIds.push(item.id)
          }
          if (item.group && item.open !== false) {
            openIds.push(item.id)
          }
        },
        // autoGroup: "type"
        autoGroup: function (item) {
          const name = item.name
          if (name) {
            if (name.indexOf("专线") !== -1 || name.indexOf("合九") !== -1) {
              return "专线"
            }
            if (name.indexOf("高铁") !== -1) {
              return "高铁"
            }
            if (name.indexOf("城际铁路") !== -1) {
              return "城际铁路"
            }
            if (name.indexOf("铁路") !== -1) {
              return "铁路"
            }
            if (name.indexOf("宁西") !== -1) {
              return "宁西"
            }
            if (name.indexOf("合肥轨道") !== -1 || name.indexOf("有轨") !== -1 || name.indexOf("地铁") !== -1) {
              return "合肥轨道"
            }
          }
          return name || "未知"
        }
      })
      console.log("获取到的graphics树", result)

      // 赋予树控件
      setTree([...result.tree])
      setCheckedKeys([...showIds])
      setExpandedKeys([...openIds])
    })
  }, [])

  const checkedChange = useCallback((keys: any, item: any) => {
    setCheckedKeys(keys)

    const node = item.node
    const graphic = mapWork.getGraphicById(node.key)
    if (graphic) {
      const show = keys.indexOf(node.key) !== -1
      graphic.show = show
    }

    // 处理子节点
    if (node.children && node.children.length) {
      node.children.forEach((child) => {
        checkedChange(keys, { node: child })
      })
    }
  }, [])

  // 点击节点 定位
  const flyToGraphic = (keys: any, item: any) => {
    const graphic = mapWork.getGraphicById(item.node.key)
    graphic.flyTo()
  }

  return (
    <>
      <MarsPannel visible={true} right={10} top={10} width={524}>
        <div className="f-mb">
          <Space>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.shoRailway()
              }}
            >
              铁路
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showExpressway()
              }}
            >
              高速公路
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showMeteorological()
              }}
            >
              气象等值面
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showGDP()
              }}
            >
              国家GDP数据
            </MarsButton>
            <MarsButton
              onClick={() => {
                setCheckedKeys([])
                mapWork.showSafetyNotice()
              }}
            >
              海上安全通告
            </MarsButton>
          </Space>
        </div>
        <LayerState direction="horizontal" />
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={100}>
        <div className="pannel">
          <MarsTree
            treeData={treeData}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            autoExpandParent
            onCheck={checkedChange}
            onSelect={flyToGraphic}
          ></MarsTree>
        </div>
      </MarsPannel>
    </>
  )
}
export default UIComponent
