import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useEffect, useState, useCallback } from "react"
import * as mapWork from "./map.js"
const layersObj: any = {}
let tianLayer
let state = false

function renderChildNode(keys: string[], children: any[]) {
  children.forEach((child) => {
    const layer = layersObj[child.key]
    if (layer) {
      if (!layer.isAdded) {
        mapWork.addLayer(layer)
      }

      if (keys.indexOf(child.key) !== -1) {
        layer.show = true
      } else {
        layer.show = false
      }
      if (child.children) {
        renderChildNode(keys, child.children)
      }
    }
  })
}
function UIComponent() {
  const [treeData, setTree] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useEffect(() => {
    mapWork.eventTarget.on("loadTypeList", function (event: any) {
      initTree(event.modelData)
    })
  }, [])

  const findChild = useCallback((parent: any, list: any[]) => {
    const expandedKeys = []
    const checkedKeys = []

    return list
      .filter((item: any) => item.pid === parent.id)
      .map((item: any) => {
        const node: any = {
          title: item.name,
          key: item.id,
          id: item.id,
          pId: item.pid 
        }
        const nodeLayer = mapWork.createLayer(item) // 创建图层
        layersObj[item.id] = nodeLayer
        node.children = findChild(node, list)

        expandedKeys.push(node.key)
        setExpandedKeys(expandedKeys)

        if (item.isAdded && item.show) {
          checkedKeys.push(node.key)
          setCheckedKeys(checkedKeys)
        }
        return node
      })
  }, [])

  // 初始化树
  const initTree = useCallback(
    (modelList: any) => {
      const dataKeys: any = []
      const layers = modelList
      const treeData = []

      // 遍历出config.json中所有的basempas和layers
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = mapWork.createLayer(mapWork.createLayer(layers[i])) // 创建图层
        if (layer && layer.pid === 20) {
          const node: any = {
            title: layer.name,
            key: layer.id,
            id: layer.id,
            pId: layer.pid 
          }
          node.children = findChild(node, layers)

          treeData.push(node)
          setTree(treeData)

          dataKeys.push(node.key)
          setExpandedKeys(dataKeys)
        }
      }
    },
    [findChild]
  )

  const checkedChange = useCallback((keys: string[], item: any) => {
    setCheckedKeys(keys)

    const node = item.node
    const layer = layersObj[node.key]
    const isChildern = node.children

    if (layer && !layer.show) {
      layer.show = true
    }

    // 增添模型
    if (isChildern.length === 0 && !node.checked) {
      mapWork.addLayer(layer)

      if (node.title === "合肥市区") {
        // 城市白模
        tianLayer = layer
        if (state === true) {
          // 判断倾斜摄影天鹅湖模型存在，重新切割防止重叠
          mapWork.cutModel(layer)
        }
      }

      if (node.title === "合肥天鹅湖" && !node.checked) {
        // 倾斜摄影天鹅湖
        state = true
        if (tianLayer) {
          mapWork.cutModel(tianLayer)
        }
      }
    }

    // 处理子节点
    if (item.node.children && item.node.children.length) {
      renderChildNode(keys, item.node.children)
    }

    // 删除模型
    if (isChildern.length === 0 && node.checked) {
      // mapWork.removeLayer(layer)
      layer.show = false
      if (node.title === "合肥天鹅湖") {
        state = false
      }
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
