import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import { LayerState } from "@mars/components/MarsSample/LayerState"
import * as mapWork from "./map.js"
const layersObj: any = {}

function UIComponent() {
  const [treeData, setTree] = useState<any[]>([
    {
      title: "全部",
      key: "0",
      id: -1,
      children: []
    }
  ])

  const [expandedKeys, setExpandedKeys] = useState<any[]>(["0"]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.treeEvent.on("tree", function (event: any) {
      initTree(event.data)
    })
  }, [])

  // 初始化树控件
  const initTree = useCallback(
    (event: any) => {
      const dataItems = event
      const children = []
      const selects: string[] = []

      // 遍历出所有的树状数据
      for (let i = 0; i < dataItems.length; i++) {
        const layer = dataItems[i]
        if (layer) {
          const key = "01-" + Math.random()
          children.push({
            title: layer.airportName,
            key,
            id: layer.graphic.id
          })

          if (layer.graphic.show) {
            selects.push(key)
          }
          layersObj[layer.graphic.id] = layer
        }
      }

      setTree([{ ...treeData[0], children }])

      setCheckedKeys(selects)
    },
    [treeData]
  )

  const checkedChange = useCallback((keys: any, checkedNodes: any) => {
    setCheckedKeys(keys)

    const show = checkedNodes.checked
    const entity = layersObj[checkedNodes.node.id]

    if (checkedNodes.node.id === -1) {
      Object.keys(layersObj).forEach((k) => {
        const layer = layersObj[k]
        layer.graphic.show = show
      })
      return
    }

    if (!show) {
      entity.graphic.show = show
    } else {
      entity.graphic.show = show
      entity.graphic.flyTo()
    }
  }, [])

  return (
    <>
      <MarsPannel visible={true} right={10} top={10}>
        <LayerState direction="horizontal"/>
      </MarsPannel>

      <MarsPannel visible={true} right={10} top={60} height={600} width={230}>
        <MarsTree
          treeData={treeData}
          onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={checkedChange}
        ></MarsTree>
      </MarsPannel>
    </>
  )
}
export default UIComponent
