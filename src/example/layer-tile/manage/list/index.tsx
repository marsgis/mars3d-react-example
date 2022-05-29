import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useMemo, useState } from "react"
import * as mapWork from "./map.js"

const layersObj: any = {}
const expandNode = [] // 展开的节点

function UIComponent() {
  const [treeData, setTree] = useState<any[]>([])
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useMemo(() => {
    mapWork.eventTarget.on("loadEnd", () => {
      initTree()
    })
  }, [])

  // 初始化树构件
  const initTree = useCallback(() => {
    const treeNode = [] // 父节点
    const layers = mapWork.getLayers()
    // 遍历出config.json中所有的basempas和layers
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]

      if (layer && layer.pid === -1) {
        const node: any = {
          title: layer.name,
          key: layer.uuid,
          id: layer.id,
          pId: layer.pid,
          uuid: layer.uuid
        }
        node.children = findChild(node, layers)
        treeNode.push(node)
        expandNode.push(node.key)
        layersObj[layer.uuid] = layer
      }
    }

    setTree(treeNode)
    setExpandedKeys(expandNode)
  }, [])

  // 查找子节点
  const findChild = useCallback((parent: any, list: any[]) => {
    const checkedNode = []
    return list
      .filter((item: any) => item.pid === parent.id)
      .map((item: any) => {
        const node: any = {
          title: item.name,
          key: item.uuid,
          id: item.id,
          pId: item.pid,
          uuid: item.uuid,
          group: item.type === "group"
        }
        layersObj[item.uuid] = item
        expandNode.push(node.key)
        if (item.hasEmptyGroup) {
          node.children = findChild(node, list)
        }
        if (item.isAdded && item.show) {
          checkedNode.push(node.key)
          setCheckedKeys(checkedNode)
        }

        return node
      })
  }, [])

  // 勾选复选框
  const checkedChange = useCallback((keys: string[], e: any) => {
    setCheckedKeys(keys)
    const layer = layersObj[e.node.key]

    if (layer) {
      if (!layer.isAdded) {
        mapWork.addLayer(layer)
      }

      // 处理子节点
      if (e.node.children && e.node.children.length) {
        renderChildNode(keys, e.node.children)
      }

      if (keys.indexOf(e.node.key) !== -1) {
        layer.show = true
        mapWork.flyToLayer(layer)
      } else {
        layer.show = false
      }
    }
  }, [])

  const renderChildNode = useCallback((keys: string[], children: any[]) => {
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
  }, [])

  return (
    <MarsPannel visible={true} top={10} right={10} bottom={40} width={250}>
      <MarsTree
        treeData={treeData}
        checkable
        onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
        expandedKeys={expandedKeys}
        checkedKeys={checkedKeys}
        onCheck={checkedChange}
      />
    </MarsPannel>
  )
}

export default UIComponent
