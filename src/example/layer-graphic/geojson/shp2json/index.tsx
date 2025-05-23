import { MarsPannel, MarsButton, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { Space } from "antd"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"
import "./index.less"

let autoGroup: any | "string" = "SSJD"
function UIComponent() {
  const [treeData, setTree] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<any[]>(["0"]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.treeEvent.on("refTree", function () {
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
        autoGroup: autoGroup
      })
      console.log("获取到的graphics树", result)

      // 赋予树控件
      setTree([...result.tree])
      setCheckedKeys([...showIds])
      setExpandedKeys([...openIds])
    })
  }, [])

  // 树控件 勾选事件
  function checkedChange(keys: string[], e: any) {
    setCheckedKeys(keys)

    const node = e.node
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
  }

  // 点击节点 定位
  const flyToGraphic = (keys: any, item: any) => {
    const graphic = mapWork.getGraphicById(item.node.key)
    graphic.flyTo()
  }

  return (
    <>
      <MarsPannel visible={true} right={10} top={30}>
        <div className="f-mb">
          <Space>
            <MarsButton
              onClick={() => {
                autoGroup = "SSJD"
                mapWork.shoXZM()
              }}
            >
              乡镇面
            </MarsButton>
            <MarsButton
              onClick={() => {
                autoGroup = function (item) {
                  const val = item.attr?.DEM
                  if (val < 100) {
                    return "<100"
                  } else if (val >= 100 && val < 200) {
                    return "100~200"
                  } else if (val >= 200 && val < 300) {
                    return "200~300"
                  } else {
                    return "300~999"
                  }
                }

                mapWork.shoGCD()
              }}
            >
              高程点
            </MarsButton>
          </Space>
        </div>
        <LayerState direction="horizontal" />
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={130} customClass="pannel">
        <MarsTree
          treeData={treeData}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={checkedChange}
          onSelect={flyToGraphic}
        ></MarsTree>
      </MarsPannel>
    </>
  )
}
export default UIComponent
