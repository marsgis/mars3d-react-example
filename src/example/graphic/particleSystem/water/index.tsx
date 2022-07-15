import { MarsPannel, MarsTree } from "@mars/components/MarsUI"
import { useCallback, useEffect, useState } from "react"
import * as mapWork from "./map.js"

const treeData = [
  {
    title: "全部",
    key: 0,
    id: -1,
    children: [
      {
        title: "1号",
        key: 1
      },
      {
        title: "2号",
        key: 2
      },
      {
        title: "3号",
        key: 3
      },
      {
        title: "4号",
        key: 4
      },
      {
        title: "5号",
        key: 5
      },
      {
        title: "6号",
        key: 6
      },
      {
        title: "7号",
        key: 7
      },
      {
        title: "8号",
        key: 8
      },
      {
        title: "9号",
        key: 9
      },
      {
        title: "10号",
        key: 10
      },
      {
        title: "11号",
        key: 11
      },
      {
        title: "12号",
        key: 12
      },
      {
        title: "13号",
        key: 13
      }
    ]
  }
]

function UIComponent() {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([0]) // 默认展开的节点
  const [checkedKeys, setCheckedKeys] = useState<any[]>([]) // 默认勾选的节点

  useEffect(() => {
    initTree()
  }, [])

  // 初始化树控件
  const initTree = useCallback(() => {
    // 遍历出所有的树状数据
    const tree = treeData[0].children
    const checkedKeys = []

    tree.forEach((element: any) => {
      checkedKeys.push(element.key)
    })
    setCheckedKeys(checkedKeys)
  }, [])

  const checkedChange = useCallback((keys: any, checkedNodes: any) => {
    setCheckedKeys(keys)

    const chilrenAll = checkedNodes.node.children
    const checkedId: number = checkedNodes.node.key
    const ischecked: boolean = checkedNodes.node.checked
    if (chilrenAll && chilrenAll.length >= 12) {
      mapWork.bindShowAll(!ischecked)
    }

    mapWork.onChangeGate(checkedId, ischecked)
  }, [])

  return (
    <MarsPannel visible={true} right={10} top={10} height={420}>
      <MarsTree
        treeData={treeData}
        onExpand={(expandedKeysValue) => setExpandedKeys(expandedKeysValue)}
        checkedKeys={checkedKeys}
        expandedKeys={expandedKeys}
        onCheck={checkedChange}
      ></MarsTree>
    </MarsPannel>
  )
}
export default UIComponent
