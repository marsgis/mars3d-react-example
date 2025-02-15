import { useState, useCallback } from "react"
import * as mapWork from "./map.js"
import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
function UIComponent() {
  const [treeData, setTreeData] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any[]>([])



  if (mapWork.eventTarget) {
    mapWork.eventTarget.on("refTree", () => {
      initTree()
    })
  }
  // 初始化树构件
  function initTree() {
    // 重置上一次的树状数据
    const showIds = [] // 是显示状态的图层id集合
    const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）
    const result = mapWork.getGraphicsTree({
      forEach: function (item) {
        item.key = item.id // 树控件api需要的唯一标识
        item.title = item.name // 树控件api需要的显示文本字段

        if (item.show) {
          showIds.push(item.id)
        }
        if (item.group && item.open !== false) {
          openIds.push(item.id)
        }
      },
      autoGroup: "level"
    })
    console.log("获取到的graphics树", result)
    // 赋予树控件
    setTreeData(result.tree)
    setCheckedKeys(showIds)
  }

  // 树控件 勾选事件
  const checkedChange = useCallback((keys: any, checkedNodes: any) => {
    setCheckedKeys(keys)

    const chilrenAll = checkedNodes.node.children
    const checkedId: number = checkedNodes.node.key
    const graphic = mapWork.getGraphicById(checkedId)
    if (graphic) {
      const show = keys.indexOf(checkedId) !== -1
      graphic.show = show
    }

    // 处理子节点
    if (chilrenAll && chilrenAll.length) {
      chilrenAll.forEach((child) => {
        checkedChange(keys, { node: child })
      })
    }
    
  }, [])

  return (
    <MarsPannel visible={true} width="400px" right="10" top="10">
      <MarsTree treeData={treeData} checkedKeys={checkedKeys} defaultExpandAll={true} onCheck={checkedChange}></MarsTree>
    </MarsPannel>
  )
}

export default UIComponent
