import { MarsDialog, MarsTree, $message } from "@mars/components/MarsUI"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import * as mapWork from "./map"

export default function ({ currentWidget, ...props }) {
  const keyVal = useRef(0)
  const [treeData, setTreeData] = useState([])

  useEffect(() => {
    ;(async () => {
      const newTreeData = []
      const url = currentWidget.data.url

      const scenetree = url.substring(0, url.lastIndexOf("/") + 1) + "scenetree.json"

      const scene: any = await axios.get(scenetree)

      if (scene.data) {
        let item = scene.data
        if (scene.data.scenes) {
          item = scene.data.scenes[0]
        }
        const childeren = isHaveChildren(item.children)
        newTreeData.push({
          title: item.name,
          key: keyVal,
          id: item.id,
          sphere: item.sphere ? item.sphere : null,
          children: childeren
        })
      }

      setTreeData(newTreeData)
    })()
  }, [currentWidget])

  function isHaveChildren(arr: any) {
    if (!arr) {
      return []
    }
    keyVal.current++
    const childeren: any[] = []
    arr.forEach((item: any) => {
      const childrenObject: any = {}
      childrenObject.title = item.name ? item.name : "element"
      childrenObject.key = keyVal + "-" + Math.random()
      childrenObject.id = item.id
      childrenObject.sphere = item.sphere

      const childOne: any = isHaveChildren(item.children)
      if (childOne.length !== 0) {
        childrenObject.children = childOne
      }
      return childeren.push(childrenObject)
    })
    return childeren
  }

  // 点击节点 定位
  function flytoModelNode(selectedKeys: any, selected: any) {
    const id = currentWidget.data.id
    mapWork.flytoModelNode(id, selected.node.sphere)
  }

  // 选中节点 修改样式
  const onModelChecked = (keys: string[], e: any) => {
    const id = currentWidget.data.id
    // 判断
    if (keys.length > 2000) {
      $message(`勾选数据${keys.length}大于2000，请减少勾选数量。`)
      return
    }
    mapWork.checkModelStyle(id, e.checkedNodes)
  }

  return (
    <MarsDialog title="模型构件" width={320} minWidth={320} left={10} top={70} bottom={50} {...props}>
      {treeData.length && <MarsTree checkable treeData={treeData} onCheck={onModelChecked} onSelect={flytoModelNode}></MarsTree>}
    </MarsDialog>
  )
}
