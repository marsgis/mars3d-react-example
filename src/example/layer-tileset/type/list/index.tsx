import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useEffect, useState, useCallback } from "react"
import * as mapWork from "./map.js"
const layersObj: any = {}

function UIComponent() {
  const [treeData, setTree] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useEffect(() => {
    mapWork.eventTarget.on("initTree", function (event: any) {
      initTree(event.modelData)
    })
  }, [])

 

  // 初始化树
  const initTree = useCallback(
    (modelList: any) => {

      const showIds = [] // 是显示状态的图层id集合
      const openIds = [] // 展开的树节点id集合（如果不想展开，对应图层配置open:false）
      const result = mapWork.getLayrsTree({
        forEach: function (item) {
          item.key = item.id // 树控件api需要的唯一标识
          item.title = item.name // 树控件api需要的显示文本字段

          if (item.show) {
            showIds.push(item.id)
          }
          if (item.group && item.open !== false) {
            openIds.push(item.id)
          }
        }
      })
      console.log("获取到的map图层树", result)

      setTree(result.tree)
      setExpandedKeys(openIds)
      setCheckedKeys(showIds)
    },
    []
  )

  const checkedChange = useCallback((keys: string[], e: any) => {
    setCheckedKeys(keys)

    const layer = mapWork.getLayerById(e.node?.key)

    if (layer) {
      const show = keys.indexOf(e.node.key) !== -1
      mapWork.updateLayerShow(layer, show)
    }

    // 处理子节点
    if (e.node.children && e.node.children.length) {
      e.node.children.forEach((child) => {
        checkedChange(keys, { node: child })
      })
    }
  }, [])

  return (
    <MarsPannel visible={true} right={10} top={10}>
      <MarsTree
        treeData={treeData}
        onCheck={checkedChange}
        onExpand={(expandedKeysValue) => {
          setExpandedKeys(expandedKeysValue)
        }}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
      ></MarsTree>
    </MarsPannel>
  )
}
export default UIComponent
